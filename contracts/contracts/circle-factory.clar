;; CircleCare Circle Factory - Clarity 4
;; Creates and manages circles of care on Stacks

;; Error Constants
(define-constant ERR-OWNER-ONLY (err u100))
(define-constant ERR-INVALID-NAME (err u101))
(define-constant ERR-INVALID-NICKNAME (err u102))
(define-constant ERR-MAX-CIRCLES-REACHED (err u103))
(define-constant ERR-INSUFFICIENT-FEE (err u104))
(define-constant ERR-CIRCLE-NOT-FOUND (err u105))
(define-constant ERR-UNAUTHORIZED (err u106))
(define-constant ERR-CIRCLE-INACTIVE (err u107))
(define-constant ERR-INVALID-CONTRACT (err u108))
(define-constant ERR-HASH-MISMATCH (err u109))
(define-constant ERR-CONVERSION (err u110))
(define-constant ERR-TREASURY-ALREADY-SET (err u111))
(define-constant ERR-PASSKEY-NOT-FOUND (err u112))
(define-constant ERR-PASSKEY-EXISTS (err u113))
(define-constant ERR-INVALID-SIGNATURE (err u114))
(define-constant ERR-PASSKEY-REQUIRED (err u115))

;; Contract Owner
(define-constant CONTRACT-OWNER tx-sender)

;; Data Variables
(define-data-var creation-fee uint u0)
(define-data-var max-circles-per-user uint u10)
(define-data-var next-circle-id uint u1)
(define-data-var total-fees-collected uint u0)

;; Data Maps

;; Circle information
(define-map circles
  uint
  {
    name: (string-ascii 50),
    creator: principal,
    created-at: uint,
    active: bool,
    treasury-contract: (optional principal),
    treasury-hash: (optional (buff 32))
  }
)

;; User's circles
(define-map user-circles
  principal
  (list 100 uint)
)

;; Circle index for iteration
(define-map circle-index
  uint
  uint
)

(define-data-var all-circles-count uint u0)

;; Passkey registry for secp256r1 authentication
(define-map passkeys
  principal
  {
    public-key: (buff 33),
    registered-at: uint,
    enabled: bool
  }
)

;; Circle passkey requirements
(define-map circle-passkey-config
  uint
  {
    require-passkey: bool,
    creator-only: bool
  }
)

;; Public Functions

;; Create a new circle
(define-public (create-circle (name (string-ascii 50)) (creator-nickname (string-ascii 32)))
  (let
    (
      (circle-id (var-get next-circle-id))
      (fee (var-get creation-fee))
      (user-circle-list (default-to (list) (map-get? user-circles tx-sender)))
      (user-circle-count (len user-circle-list))
      (timestamp stacks-block-time)
    )
    ;; Validations
    (asserts! (> (len name) u0) ERR-INVALID-NAME)
    (asserts! (<= (len name) u50) ERR-INVALID-NAME)
    (asserts! (> (len creator-nickname) u0) ERR-INVALID-NICKNAME)
    (asserts! (<= (len creator-nickname) u32) ERR-INVALID-NICKNAME)
    (asserts! (< user-circle-count (var-get max-circles-per-user)) ERR-MAX-CIRCLES-REACHED)

    ;; Handle fee payment if required
    (if (> fee u0)
      (begin
        (try! (stx-transfer? fee tx-sender CONTRACT-OWNER))
        (var-set total-fees-collected (+ (var-get total-fees-collected) fee))
      )
      true
    )

    ;; Create circle info using stacks-block-time
    (map-set circles circle-id {
      name: name,
      creator: tx-sender,
      created-at: timestamp,
      active: true,
      treasury-contract: none,
      treasury-hash: none
    })

    ;; Add to user's circles
    (map-set user-circles tx-sender
      (unwrap! (as-max-len? (append user-circle-list circle-id) u100) ERR-MAX-CIRCLES-REACHED))

    ;; Add to circle index
    (map-set circle-index (var-get all-circles-count) circle-id)
    (var-set all-circles-count (+ (var-get all-circles-count) u1))

    ;; Increment next circle ID
    (var-set next-circle-id (+ circle-id u1))

    ;; Emit event with to-ascii? for logging
    (print {
      event: "circle-created",
      circle-id: circle-id,
      creator: tx-sender,
      name: name,
      timestamp: timestamp
    })

    (ok circle-id)
  )
)

;; Add user to circle
(define-public (add-user-to-circle (user principal) (circle-id uint))
  (let
    (
      (circle (unwrap! (map-get? circles circle-id) ERR-CIRCLE-NOT-FOUND))
      (user-circle-list (default-to (list) (map-get? user-circles user)))
    )
    ;; Only creator can add users
    (asserts! (is-eq tx-sender (get creator circle)) ERR-UNAUTHORIZED)
    (asserts! (get active circle) ERR-CIRCLE-INACTIVE)

    ;; Check if user already has this circle
    (if (is-some (index-of user-circle-list circle-id))
      (ok true)
      (begin
        (asserts! (< (len user-circle-list) (var-get max-circles-per-user)) ERR-MAX-CIRCLES-REACHED)
        (map-set user-circles user
          (unwrap! (as-max-len? (append user-circle-list circle-id) u100) ERR-MAX-CIRCLES-REACHED))
        (print {event: "user-added-to-circle", user: user, circle-id: circle-id})
        (ok true)
      )
    )
  )
)

;; Verify and set treasury contract using contract-hash?
(define-public (set-treasury-contract (circle-id uint) (treasury principal))
  (let
    (
      (circle (unwrap! (map-get? circles circle-id) ERR-CIRCLE-NOT-FOUND))
      (hash-result (contract-hash? treasury))
    )
    ;; Only creator can set treasury
    (asserts! (is-eq tx-sender (get creator circle)) ERR-UNAUTHORIZED)
    ;; Can only set once
    (asserts! (is-none (get treasury-contract circle)) ERR-TREASURY-ALREADY-SET)

    ;; Verify it's a valid contract and get its hash
    (match hash-result
      hash-value
        (begin
          (map-set circles circle-id (merge circle {
            treasury-contract: (some treasury),
            treasury-hash: (some hash-value)
          }))
          (print {event: "treasury-set", circle-id: circle-id, treasury: treasury})
          (ok true)
        )
      err-code ERR-INVALID-CONTRACT
    )
  )
)

;; Verify treasury contract hash
(define-public (verify-treasury-contract (circle-id uint) (treasury principal))
  (let
    (
      (circle (unwrap! (map-get? circles circle-id) ERR-CIRCLE-NOT-FOUND))
      (stored-hash (unwrap! (get treasury-hash circle) ERR-INVALID-CONTRACT))
      (current-hash (unwrap! (contract-hash? treasury) ERR-INVALID-CONTRACT))
    )
    (asserts! (is-eq stored-hash current-hash) ERR-HASH-MISMATCH)
    (ok true)
  )
)

;; Deactivate circle
(define-public (deactivate-circle (circle-id uint))
  (let
    (
      (circle (unwrap! (map-get? circles circle-id) ERR-CIRCLE-NOT-FOUND))
      (timestamp stacks-block-time)
    )
    (asserts!
      (or
        (is-eq tx-sender (get creator circle))
        (is-eq tx-sender CONTRACT-OWNER)
      )
      ERR-UNAUTHORIZED
    )

    (map-set circles circle-id (merge circle {active: false}))
    (print {event: "circle-deactivated", circle-id: circle-id, timestamp: timestamp})
    (ok true)
  )
)

;; Read-Only Functions

;; Get circle information
(define-read-only (get-circle-info (circle-id uint))
  (map-get? circles circle-id)
)

;; Get user's circles
(define-read-only (get-user-circles (user principal))
  (default-to (list) (map-get? user-circles user))
)

;; Get active user circles only
(define-read-only (get-active-user-circles (user principal))
  (let
    (
      (user-circle-list (default-to (list) (map-get? user-circles user)))
    )
    (filter is-circle-active user-circle-list)
  )
)

;; Check if circle is active
(define-read-only (is-circle-active (circle-id uint))
  (match (map-get? circles circle-id)
    circle (get active circle)
    false
  )
)

;; Get circle stats
(define-read-only (get-circle-stats (circle-id uint))
  (match (map-get? circles circle-id)
    circle (ok {
      name: (get name circle),
      creator: (get creator circle),
      created-at: (get created-at circle),
      active: (get active circle),
      has-treasury: (is-some (get treasury-contract circle))
    })
    ERR-CIRCLE-NOT-FOUND
  )
)

;; Get creation fee
(define-read-only (get-creation-fee)
  (var-get creation-fee)
)

;; Get max circles per user
(define-read-only (get-max-circles-per-user)
  (var-get max-circles-per-user)
)

;; Get next circle ID
(define-read-only (get-next-circle-id)
  (var-get next-circle-id)
)

;; Get total circles count
(define-read-only (get-total-circles-count)
  (var-get all-circles-count)
)

;; Get circle at index
(define-read-only (get-circle-at-index (index uint))
  (default-to u0 (map-get? circle-index index))
)

;; Admin Functions

;; Set creation fee
(define-public (set-creation-fee (new-fee uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-OWNER-ONLY)
    (var-set creation-fee new-fee)
    (print {event: "creation-fee-updated", new-fee: new-fee})
    (ok true)
  )
)

;; Set max circles per user
(define-public (set-max-circles-per-user (new-max uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-OWNER-ONLY)
    (asserts! (> new-max u0) ERR-INVALID-NAME)
    (asserts! (<= new-max u100) ERR-INVALID-NAME)
    (var-set max-circles-per-user new-max)
    (print {event: "max-circles-updated", new-max: new-max})
    (ok true)
  )
)

;; Withdraw collected fees
(define-public (withdraw-fees)
  (let
    (
      (total-collected (var-get total-fees-collected))
    )
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-OWNER-ONLY)
    (asserts! (> total-collected u0) ERR-INSUFFICIENT-FEE)

    ;; Fees are held by contract owner, so no need for as-contract
    (print {event: "fees-withdrawn", amount: total-collected})
    (ok total-collected)
  )
)

;; Get total fees collected
(define-read-only (get-total-fees-collected)
  (var-get total-fees-collected)
)

;; Passkey Authentication Functions (Clarity 4 secp256r1-verify)

;; Register a passkey for authentication
(define-public (register-passkey (public-key (buff 33)))
  (let
    (
      (existing-passkey (map-get? passkeys tx-sender))
    )
    ;; Check if passkey already exists
    (asserts! (is-none existing-passkey) ERR-PASSKEY-EXISTS)
    
    ;; Store passkey
    (map-set passkeys tx-sender {
      public-key: public-key,
      registered-at: stacks-block-time,
      enabled: true
    })
    
    (print {
      event: "passkey-registered",
      principal: tx-sender,
      timestamp: stacks-block-time
    })
    (ok true)
  )
)

;; Update passkey (disable/enable)
(define-public (update-passkey-status (enabled bool))
  (let
    (
      (passkey (unwrap! (map-get? passkeys tx-sender) ERR-PASSKEY-NOT-FOUND))
    )
    (map-set passkeys tx-sender (merge passkey {enabled: enabled}))
    (print {event: "passkey-status-updated", principal: tx-sender, enabled: enabled})
    (ok true)
  )
)

;; Verify passkey signature using secp256r1-verify
(define-public (verify-passkey-signature 
  (message-hash (buff 32))
  (signature (buff 64))
  (signer principal))
  (let
    (
      (passkey (unwrap! (map-get? passkeys signer) ERR-PASSKEY-NOT-FOUND))
    )
    (asserts! (get enabled passkey) ERR-PASSKEY-NOT-FOUND)
    (asserts! 
      (secp256r1-verify message-hash signature (get public-key passkey))
      ERR-INVALID-SIGNATURE
    )
    (ok true)
  )
)

;; Set passkey requirement for a circle
(define-public (set-circle-passkey-requirement 
  (circle-id uint)
  (require-passkey bool)
  (creator-only bool))
  (let
    (
      (circle (unwrap! (map-get? circles circle-id) ERR-CIRCLE-NOT-FOUND))
    )
    (asserts! (is-eq tx-sender (get creator circle)) ERR-UNAUTHORIZED)
    
    (map-set circle-passkey-config circle-id {
      require-passkey: require-passkey,
      creator-only: creator-only
    })
    
    (print {
      event: "circle-passkey-config-updated",
      circle-id: circle-id,
      require-passkey: require-passkey
    })
    (ok true)
  )
)

;; Get passkey info
(define-read-only (get-passkey-info (user principal))
  (map-get? passkeys user)
)

;; Get circle passkey config
(define-read-only (get-circle-passkey-config (circle-id uint))
  (default-to {require-passkey: false, creator-only: false}
    (map-get? circle-passkey-config circle-id))
)

;; ASCII Conversion Functions (Clarity 4 to-ascii?)

;; Generate human-readable circle receipt
(define-read-only (generate-circle-receipt (circle-id uint))
  (match (map-get? circles circle-id)
    circle
      (ok {
        circle-id: circle-id,
        name: (get name circle),
        creator-ascii: (to-ascii? (get creator circle)),
        created-at: (get created-at circle),
        created-at-ascii: (to-ascii? (get created-at circle)),
        active: (get active circle),
        active-ascii: (to-ascii? (get active circle))
      })
    ERR-CIRCLE-NOT-FOUND
  )
)

;; Convert principal to ASCII for logging
(define-read-only (principal-to-ascii (p principal))
  (to-ascii? p)
)

;; Convert uint to ASCII for logging
(define-read-only (uint-to-ascii (n uint))
  (to-ascii? n)
)
