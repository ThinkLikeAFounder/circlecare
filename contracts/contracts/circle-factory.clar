;; title: circle-factory
;; version: 1.0.0
;; summary: Factory contract for creating and managing care circles
;; description: This contract handles the creation of care circles, member management,
;;              and provides the core infrastructure for CircleCare's community-based
;;              expense sharing system. Built with Clarity 4 features for enhanced security.

;; traits
;; Define traits for extensibility and interface compliance

;; token definitions
;; No custom tokens defined - uses native STX for all operations

;; constants
;; Error codes for consistent error handling across the application
(define-constant ERR_UNAUTHORIZED (err u401))        ;; User lacks required permissions
(define-constant ERR_NOT_FOUND (err u404))           ;; Requested resource doesn't exist
(define-constant ERR_INVALID_INPUT (err u400))       ;; Invalid input parameters
(define-constant ERR_ALREADY_EXISTS (err u409))      ;; Resource already exists
(define-constant ERR_LIMIT_EXCEEDED (err u413))      ;; Operation exceeds system limits
(define-constant ERR_INTERNAL_ERROR (err u500))      ;; Unexpected system error

;; System limits to prevent abuse and ensure performance
(define-constant MAX_CIRCLE_NAME_LENGTH u50)         ;; Maximum characters in circle name
(define-constant MAX_MEMBERS_PER_CIRCLE u20)         ;; Maximum members allowed per circle
(define-constant MAX_CIRCLES_PER_USER u50)           ;; Maximum circles one user can create

;; data vars
;; Global state variables for tracking system-wide information
(define-data-var next-circle-id uint u1)             ;; Auto-incrementing circle ID counter
(define-data-var total-circles uint u0)              ;; Total number of circles created
(define-data-var contract-owner principal tx-sender) ;; Contract deployer for admin functions

;; data maps
;; Core data structures for storing circle and membership information

;; Main circle registry - stores essential circle information
(define-map circles uint {
  name: (string-ascii 50),                           ;; Human-readable circle name
  creator: principal,                                ;; Circle creator (has admin privileges)
  created-at: uint,                                  ;; Block height when circle was created
  member-count: uint,                                ;; Current number of members
  is-active: bool                                    ;; Whether circle accepts new operations
})

;; Circle membership tracking - maps circle-id to list of member principals
(define-map circle-members uint (list 20 principal))

;; Reverse lookup - maps user to their created circles for efficient querying
(define-map user-circles principal (list 50 uint))

;; Member participation tracking - maps (circle-id, member) to membership details
(define-map member-info {circle-id: uint, member: principal} {
  joined-at: uint,                                   ;; Block height when member joined
  is-active: bool,                                   ;; Whether member can participate
  role: (string-ascii 20)                           ;; Member role (creator, member, etc.)
})

;; public functions
;; External functions that users can call to interact with the contract

;; Creates a new care circle with the specified name
;; @param name: Circle name (1-50 ASCII characters, no special chars)
;; @returns: Circle ID on success, error code on failure
(define-public (create-circle (name (string-ascii 50)))
  (let (
    (circle-id (var-get next-circle-id))             ;; Get next available circle ID
    (creator tx-sender)                              ;; Circle creator is transaction sender
    (current-block stacks-block-time)                ;; Current block timestamp
  )
    ;; Input validation - ensure name is not empty and within limits
    (asserts! (> (len name) u0) ERR_INVALID_INPUT)
    (asserts! (<= (len name) MAX_CIRCLE_NAME_LENGTH) ERR_INVALID_INPUT)
    
    ;; Check if user hasn't exceeded their circle creation limit
    (asserts! (< (len (default-to (list) (map-get? user-circles creator))) MAX_CIRCLES_PER_USER) ERR_LIMIT_EXCEEDED)
    
    ;; Create the circle record
    (map-set circles circle-id {
      name: name,
      creator: creator,
      created-at: current-block,
      member-count: u1,                              ;; Creator is automatically first member
      is-active: true
    })
    
    ;; Initialize member list with creator
    (map-set circle-members circle-id (list creator))
    
    ;; Add creator's membership info
    (map-set member-info {circle-id: circle-id, member: creator} {
      joined-at: current-block,
      is-active: true,
      role: "creator"
    })
    
    ;; Update creator's circle list
    (map-set user-circles creator 
      (unwrap! (as-max-len? 
        (append (default-to (list) (map-get? user-circles creator)) circle-id) 
        u50) ERR_INTERNAL_ERROR))
    
    ;; Update global counters
    (var-set next-circle-id (+ circle-id u1))
    (var-set total-circles (+ (var-get total-circles) u1))
    
    ;; Emit event for off-chain indexing
    (print {event: "circle-created", circle-id: circle-id, name: name, creator: creator})
    
    ;; Return success with new circle ID
    (ok circle-id)
  )
)

;; read only functions
;; Functions for querying contract state without modifying it

;; Retrieves complete circle information by ID
;; @param circle-id: ID of the circle to retrieve
;; @returns: Circle data tuple or error if not found
(define-read-only (get-circle (circle-id uint))
  (match (map-get? circles circle-id)
    circle-data (ok circle-data)
    ERR_NOT_FOUND
  )
)

;; Gets the list of all members in a circle
;; @param circle-id: ID of the target circle
;; @returns: List of member principals or error if circle not found
(define-read-only (get-circle-members (circle-id uint))
  (match (map-get? circle-members circle-id)
    members (ok members)
    ERR_NOT_FOUND
  )
)

;; Checks if a principal is a member of the specified circle
;; @param circle-id: ID of the circle to check
;; @param member: Principal address to verify
;; @returns: true if member exists, false otherwise, error if circle not found
(define-read-only (is-circle-member (circle-id uint) (member principal))
  (match (map-get? circle-members circle-id)
    members (ok (is-some (index-of members member)))
    ERR_NOT_FOUND
  )
)

;; Gets all circles created by a specific user
;; @param user: Principal address of the user
;; @returns: List of circle IDs created by the user
(define-read-only (get-user-circles (user principal))
  (ok (default-to (list) (map-get? user-circles user)))
)

;; Gets total number of circles in the system
;; @returns: Total circle count
(define-read-only (get-total-circles)
  (ok (var-get total-circles))
)

;; private functions
;; Internal helper functions not accessible from outside the contract

;; Validates that a circle name meets requirements
;; @param name: Circle name to validate
;; @returns: true if valid, false otherwise
(define-private (is-valid-circle-name (name (string-ascii 50)))
  (and 
    (> (len name) u0)                                ;; Not empty
    (<= (len name) MAX_CIRCLE_NAME_LENGTH)           ;; Within length limit
    ;; Additional validation can be added here (e.g., no profanity, special chars)
  )
)

;; Checks if a user has permission to modify a circle
;; @param circle-id: ID of the circle
;; @param user: Principal to check permissions for
;; @returns: true if user is circle creator, false otherwise
(define-private (has-circle-admin-permission (circle-id uint) (user principal))
  (match (map-get? circles circle-id)
    circle-data (is-eq (get creator circle-data) user)
    false
  )
)

