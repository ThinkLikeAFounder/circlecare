;; CircleCare Circle Treasury - Clarity 4
;; Manages expenses, settlements, and balances with restrict-assets? protection

;; Error Constants
(define-constant ERR-UNAUTHORIZED (err u200))
(define-constant ERR-INVALID-AMOUNT (err u201))
(define-constant ERR-INVALID-PARTICIPANT (err u202))
(define-constant ERR-EXPENSE-NOT-FOUND (err u203))
(define-constant ERR-INSUFFICIENT-PAYMENT (err u204))
(define-constant ERR-NO-DEBT (err u205))
(define-constant ERR-MEMBER-NOT-FOUND (err u206))
(define-constant ERR-INVALID-DESCRIPTION (err u207))
(define-constant ERR-CIRCLE-PAUSED (err u208))
(define-constant ERR-MEMBER-EXISTS (err u209))
(define-constant ERR-MAX-MEMBERS (err u210))
(define-constant ERR-MAX-PARTICIPANTS (err u211))
(define-constant ERR-CIRCLE-NOT-FOUND (err u212))
(define-constant ERR-DUPLICATE-PARTICIPANT (err u213))
(define-constant ERR-MEMBER-HAS-BALANCE (err u214))
(define-constant ERR-TRANSFER-FAILED (err u215))
(define-constant ERR-ASSET-RESTRICTION (err u216))
(define-constant ERR-EXPENSE-EXPIRED (err u217))
(define-constant ERR-CONVERSION (err u218))

;; Constants
(define-constant MAX-PARTICIPANTS u20)
(define-constant MAX-MEMBERS u50)
(define-constant MAX-DESCRIPTION-LENGTH u200)

;; Data Maps

;; Circle metadata
(define-map circles
  uint
  {
    name: (string-ascii 50),
    creator: principal,
    created-at: uint,
    paused: bool,
    next-expense-id: uint,
    next-settlement-id: uint,
    member-count: uint
  }
)

;; Members with balances
(define-map members
  {circle-id: uint, member: principal}
  {
    nickname: (string-ascii 32),
    total-owed: uint,
    total-owing: uint,
    active: bool,
    joined-at: uint
  }
)

;; Expenses with expiration support
(define-map expenses
  {circle-id: uint, expense-id: uint}
  {
    description: (string-ascii 200),
    total-amount: uint,
    paid-by: principal,
    settled: bool,
    timestamp: uint,
    expires-at: (optional uint),
    participant-count: uint
  }
)

;; Expense participants
(define-map expense-participants
  {circle-id: uint, expense-id: uint, index: uint}
  {participant: principal, share: uint}
)

;; Balances between members
(define-map balances
  {circle-id: uint, debtor: principal, creditor: principal}
  uint
)

;; Settlement history
(define-map settlements
  {circle-id: uint, settlement-id: uint}
  {
    debtor: principal,
    creditor: principal,
    amount: uint,
    timestamp: uint
  }
)

;; Member list for iteration
(define-map group-member-list
  {circle-id: uint, index: uint}
  principal
)

;; Public Functions

;; Initialize a circle (called by factory or creator)
(define-public (initialize-circle (circle-id uint) (name (string-ascii 50)) (creator principal) (creator-nickname (string-ascii 32)))
  (begin
    ;; Check that circle doesn't already exist
    (asserts! (is-none (map-get? circles circle-id)) ERR-CIRCLE-NOT-FOUND)

    ;; Create circle with stacks-block-time
    (map-set circles circle-id {
      name: name,
      creator: creator,
      created-at: stacks-block-time,
      paused: false,
      next-expense-id: u1,
      next-settlement-id: u1,
      member-count: u1
    })

    ;; Add creator as first member
    (map-set members {circle-id: circle-id, member: creator} {
      nickname: creator-nickname,
      total-owed: u0,
      total-owing: u0,
      active: true,
      joined-at: stacks-block-time
    })

    ;; Add to member list
    (map-set group-member-list {circle-id: circle-id, index: u0} creator)

    (print {event: "circle-initialized", circle-id: circle-id, creator: creator})
    (ok true)
  )
)

;; Add member to circle (only creator)
(define-public (add-member (circle-id uint) (member principal) (nickname (string-ascii 32)))
  (let
    (
      (circle (unwrap! (map-get? circles circle-id) ERR-CIRCLE-NOT-FOUND))
      (member-key {circle-id: circle-id, member: member})
    )
    ;; Validations
    (asserts! (is-eq tx-sender (get creator circle)) ERR-UNAUTHORIZED)
    (asserts! (not (get paused circle)) ERR-CIRCLE-PAUSED)
    (asserts! (< (get member-count circle) MAX-MEMBERS) ERR-MAX-MEMBERS)
    (asserts! (> (len nickname) u0) ERR-INVALID-DESCRIPTION)
    (asserts! (<= (len nickname) u32) ERR-INVALID-DESCRIPTION)
    (asserts! (is-none (map-get? members member-key)) ERR-MEMBER-EXISTS)

    ;; Add member
    (map-set members member-key {
      nickname: nickname,
      total-owed: u0,
      total-owing: u0,
      active: true,
      joined-at: stacks-block-time
    })

    ;; Add to member list
    (map-set group-member-list
      {circle-id: circle-id, index: (get member-count circle)}
      member)

    ;; Update member count
    (map-set circles circle-id (merge circle {
      member-count: (+ (get member-count circle) u1)
    }))

    (print {event: "member-added", circle-id: circle-id, member: member})
    (ok true)
  )
)

;; Add expense with automatic share distribution
(define-public (add-expense
  (circle-id uint)
  (description (string-ascii 200))
  (amount uint)
  (participants (list 20 principal)))
  (let
    (
      (circle (unwrap! (map-get? circles circle-id) ERR-CIRCLE-NOT-FOUND))
      (expense-id (get next-expense-id circle))
      (participant-count (len participants))
      (member-key {circle-id: circle-id, member: tx-sender})
    )
    ;; Validations
    (asserts! (not (get paused circle)) ERR-CIRCLE-PAUSED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (> participant-count u0) ERR-INVALID-PARTICIPANT)
    (asserts! (<= participant-count MAX-PARTICIPANTS) ERR-MAX-PARTICIPANTS)
    (asserts! (> (len description) u0) ERR-INVALID-DESCRIPTION)
    (asserts! (<= (len description) MAX-DESCRIPTION-LENGTH) ERR-INVALID-DESCRIPTION)
    (asserts! (get active (unwrap! (map-get? members member-key) ERR-MEMBER-NOT-FOUND)) ERR-UNAUTHORIZED)

    ;; Validate all participants are active members
    (try! (validate-participants circle-id participants))

    ;; Calculate shares after validation
    (let
      (
        (share-per-person (/ amount participant-count))
        (remainder (mod amount participant-count))
      )
      ;; Store expense with stacks-block-time
      (map-set expenses {circle-id: circle-id, expense-id: expense-id} {
        description: description,
        total-amount: amount,
        paid-by: tx-sender,
        settled: false,
        timestamp: stacks-block-time,
        expires-at: none,
        participant-count: participant-count
      })

      ;; Process participants and update balances
      (try! (process-participants circle-id expense-id participants share-per-person remainder tx-sender))

      ;; Update next expense ID
      (map-set circles circle-id (merge circle {
        next-expense-id: (+ expense-id u1)
      }))

      (print {event: "expense-added", circle-id: circle-id, expense-id: expense-id, amount: amount})
      (ok expense-id)
    )
  )
)

;; Settle debt using restrict-assets? for protection
(define-public (settle-debt-stx (circle-id uint) (creditor principal))
  (let
    (
      (circle (unwrap! (map-get? circles circle-id) ERR-CIRCLE-NOT-FOUND))
      (balance-key {circle-id: circle-id, debtor: tx-sender, creditor: creditor})
      (debt (default-to u0 (map-get? balances balance-key)))
      (settlement-id (get next-settlement-id circle))
      (debtor-key {circle-id: circle-id, member: tx-sender})
      (creditor-key {circle-id: circle-id, member: creditor})
      (debtor-info (unwrap! (map-get? members debtor-key) ERR-MEMBER-NOT-FOUND))
      (creditor-info (unwrap! (map-get? members creditor-key) ERR-MEMBER-NOT-FOUND))
    )
    ;; Validations
    (asserts! (not (get paused circle)) ERR-CIRCLE-PAUSED)
    (asserts! (> debt u0) ERR-NO-DEBT)
    (asserts! (get active debtor-info) ERR-UNAUTHORIZED)
    (asserts! (get active creditor-info) ERR-MEMBER-NOT-FOUND)

    ;; Use restrict-assets? to protect STX transfer
    (ok (try! (restrict-assets?
      tx-sender
      ((with-stx debt))
      (begin
        ;; Perform the transfer
        (try! (stx-transfer? debt tx-sender creditor))

        ;; Update balances
        (map-delete balances balance-key)

        ;; Update member totals
        (map-set members debtor-key (merge debtor-info {
          total-owed: (- (get total-owed debtor-info) debt)
        }))
        (map-set members creditor-key (merge creditor-info {
          total-owing: (- (get total-owing creditor-info) debt)
        }))

        ;; Record settlement
        (map-set settlements {circle-id: circle-id, settlement-id: settlement-id} {
          debtor: tx-sender,
          creditor: creditor,
          amount: debt,
          timestamp: stacks-block-time
        })

        ;; Update next settlement ID
        (map-set circles circle-id (merge circle {
          next-settlement-id: (+ settlement-id u1)
        }))

        (print {event: "debt-settled", circle-id: circle-id, debtor: tx-sender, creditor: creditor, amount: debt})
        settlement-id
      )
    )))
  )
)

;; Pause circle (only creator)
(define-public (pause-circle (circle-id uint))
  (let
    (
      (circle (unwrap! (map-get? circles circle-id) ERR-CIRCLE-NOT-FOUND))
    )
    (asserts! (is-eq tx-sender (get creator circle)) ERR-UNAUTHORIZED)
    (map-set circles circle-id (merge circle {paused: true}))
    (print {event: "circle-paused", circle-id: circle-id})
    (ok true)
  )
)

;; Unpause circle (only creator)
(define-public (unpause-circle (circle-id uint))
  (let
    (
      (circle (unwrap! (map-get? circles circle-id) ERR-CIRCLE-NOT-FOUND))
    )
    (asserts! (is-eq tx-sender (get creator circle)) ERR-UNAUTHORIZED)
    (map-set circles circle-id (merge circle {paused: false}))
    (print {event: "circle-unpaused", circle-id: circle-id})
    (ok true)
  )
)

;; Update expense description (only creator, only if not settled)
(define-public (update-expense-description (circle-id uint) (expense-id uint) (new-description (string-ascii 200)))
  (let
    (
      (expense-key {circle-id: circle-id, expense-id: expense-id})
      (expense (unwrap! (map-get? expenses expense-key) ERR-EXPENSE-NOT-FOUND))
    )
    (asserts! (is-eq tx-sender (get paid-by expense)) ERR-UNAUTHORIZED)
    (asserts! (not (get settled expense)) ERR-UNAUTHORIZED)
    (asserts! (> (len new-description) u0) ERR-INVALID-DESCRIPTION)
    (asserts! (<= (len new-description) MAX-DESCRIPTION-LENGTH) ERR-INVALID-DESCRIPTION)

    (map-set expenses expense-key (merge expense {description: new-description}))
    (print {event: "expense-updated", circle-id: circle-id, expense-id: expense-id})
    (ok true)
  )
)

;; Remove member (only creator, only if zero balance)
(define-public (remove-member (circle-id uint) (member principal))
  (let
    (
      (circle (unwrap! (map-get? circles circle-id) ERR-CIRCLE-NOT-FOUND))
      (member-key {circle-id: circle-id, member: member})
      (member-info (unwrap! (map-get? members member-key) ERR-MEMBER-NOT-FOUND))
    )
    (asserts! (is-eq tx-sender (get creator circle)) ERR-UNAUTHORIZED)
    (asserts! (not (is-eq member (get creator circle))) ERR-UNAUTHORIZED)
    (asserts! (is-eq (get total-owed member-info) u0) ERR-MEMBER-HAS-BALANCE)
    (asserts! (is-eq (get total-owing member-info) u0) ERR-MEMBER-HAS-BALANCE)

    ;; Deactivate member
    (map-set members member-key (merge member-info {active: false}))
    (print {event: "member-removed", circle-id: circle-id, member: member})
    (ok true)
  )
)

;; Private Helper Functions

;; Validate all participants are active members
(define-private (validate-participants (circle-id uint) (participants (list 20 principal)))
  (fold validate-participant participants (ok circle-id))
)

(define-private (validate-participant (participant principal) (acc (response uint uint)))
  (match acc
    success
      (let
        (
          (member-key {circle-id: success, member: participant})
          (member-info (map-get? members member-key))
        )
        (if (and (is-some member-info) (get active (unwrap-panic member-info)))
          (ok success)
          ERR-INVALID-PARTICIPANT
        )
      )
    error (err error)
  )
)

;; Process participants and update balances
(define-private (process-participants
  (circle-id uint)
  (expense-id uint)
  (participants (list 20 principal))
  (base-share uint)
  (remainder uint)
  (paid-by principal))
  (let
    (
      (context {
        circle-id: circle-id,
        expense-id: expense-id,
        base-share: base-share,
        remainder: remainder,
        paid-by: paid-by,
        current-index: u0
      })
    )
    (fold process-single-participant participants (ok context))
  )
)

(define-private (process-single-participant
  (participant principal)
  (acc (response {circle-id: uint, expense-id: uint, base-share: uint, remainder: uint, paid-by: principal, current-index: uint} uint)))
  (match acc
    success
      (let
        (
          (index (get current-index success))
          (circle-id (get circle-id success))
          (expense-id (get expense-id success))
          (base-share (get base-share success))
          (remainder (get remainder success))
          (paid-by (get paid-by success))
          (share (if (< index remainder) (+ base-share u1) base-share))
        )
        ;; Store participant and share
        (map-set expense-participants
          {circle-id: circle-id, expense-id: expense-id, index: index}
          {participant: participant, share: share})

        ;; Update balances if not the payer
        (if (not (is-eq participant paid-by))
          (update-balance circle-id participant paid-by share)
          true
        )

        ;; Return updated context
        (ok (merge success {current-index: (+ index u1)}))
      )
    error (err error)
  )
)

;; Update balance between debtor and creditor
(define-private (update-balance (circle-id uint) (debtor principal) (creditor principal) (amount uint))
  (let
    (
      (balance-key {circle-id: circle-id, debtor: debtor, creditor: creditor})
      (current-balance (default-to u0 (map-get? balances balance-key)))
      (debtor-key {circle-id: circle-id, member: debtor})
      (creditor-key {circle-id: circle-id, member: creditor})
      (debtor-info (unwrap-panic (map-get? members debtor-key)))
      (creditor-info (unwrap-panic (map-get? members creditor-key)))
    )
    ;; Update balance
    (map-set balances balance-key (+ current-balance amount))

    ;; Update member totals
    (map-set members debtor-key (merge debtor-info {
      total-owed: (+ (get total-owed debtor-info) amount)
    }))
    (map-set members creditor-key (merge creditor-info {
      total-owing: (+ (get total-owing creditor-info) amount)
    }))
    true
  )
)

;; Read-Only Functions

;; Get circle info
(define-read-only (get-circle (circle-id uint))
  (map-get? circles circle-id)
)

;; Get member info
(define-read-only (get-member-info (circle-id uint) (member principal))
  (map-get? members {circle-id: circle-id, member: member})
)

;; Get expense
(define-read-only (get-expense (circle-id uint) (expense-id uint))
  (map-get? expenses {circle-id: circle-id, expense-id: expense-id})
)

;; Get expense participant
(define-read-only (get-expense-participant (circle-id uint) (expense-id uint) (index uint))
  (map-get? expense-participants {circle-id: circle-id, expense-id: expense-id, index: index})
)

;; Get balance between debtor and creditor
(define-read-only (get-balance (circle-id uint) (debtor principal) (creditor principal))
  (default-to u0 (map-get? balances {circle-id: circle-id, debtor: debtor, creditor: creditor}))
)

;; Get net balance for a member
(define-read-only (get-net-balance (circle-id uint) (member principal))
  (let
    (
      (member-info (unwrap! (map-get? members {circle-id: circle-id, member: member}) ERR-MEMBER-NOT-FOUND))
    )
    (ok (- (get total-owing member-info) (get total-owed member-info)))
  )
)

;; Get settlement
(define-read-only (get-settlement (circle-id uint) (settlement-id uint))
  (map-get? settlements {circle-id: circle-id, settlement-id: settlement-id})
)

;; Get circle stats
(define-read-only (get-circle-stats (circle-id uint))
  (let
    (
      (circle (unwrap! (map-get? circles circle-id) ERR-CIRCLE-NOT-FOUND))
    )
    (ok {
      name: (get name circle),
      creator: (get creator circle),
      member-count: (get member-count circle),
      total-expenses: (- (get next-expense-id circle) u1),
      total-settlements: (- (get next-settlement-id circle) u1),
      paused: (get paused circle)
    })
  )
)

;; Get member at index
(define-read-only (get-member-at-index (circle-id uint) (index uint))
  (map-get? group-member-list {circle-id: circle-id, index: index})
)

;; Check if expense is expired
(define-read-only (is-expense-expired (circle-id uint) (expense-id uint))
  (match (get expires-at (unwrap! (get-expense circle-id expense-id) false))
    expiry (> stacks-block-time expiry)
    false
  )
)
