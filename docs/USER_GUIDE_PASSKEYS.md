# CircleCare Passkey Authentication Guide

CircleCare now supports **Passkeys** for secure, passwordless authentication using the Clarity 4 `secp256r1-verify` feature.

## What are Passkeys?

Passkeys are a safer and easier replacement for passwords and seed phrases for daily operations. You can use:
- TouchID / FaceID (iOS/Mac)
- Windows Hello (Face/Fingerprint)
- Android Biometrics
- Hardware keys (YubiKey)

## Setting Up Your Passkey

### 1. Registration
To start using passkeys, you must register your public key on-chain:

1. generate a standard WebAuthn credential on your device
2. Extract the public key (secp256r1)
3. Call `register-passkey` with your public key

```clarity
(contract-call? .circle-factory register-passkey 0x...)
```

### 2. Managing Passkeys
You can temporarily disable your passkey if needed:

```clarity
(contract-call? .circle-factory update-passkey-status false)
```

## Using Passkeys in Circles

### Creating a Secure Circle
When creating a circle, you can now enforce passkey usage for all operations:

1. Create the circle normally
2. Call `set-circle-passkey-requirement`:
   - `require-passkey`: true (All members must use passkeys)
   - `creator-only`: true (Only creator needs passkeys for admin tasks)

### Passkey-Protected Settlement
Settling debts can now be secured by biometric signatures:

1. Sign a message hash with your passkey
2. Call `settle-debt-with-passkey` in the treasury contract:

```clarity
(contract-call? .circle-treasury settle-debt-with-passkey 
    circle-id 
    creditor 
    message-hash 
    signature 
    .circle-factory)
```

This ensures that even if your private key is compromised, funds cannot be moved without your physical biometric authorization.

## Security Notes

> [!IMPORTANT]
> Passkeys are an **additional** layer of security. They do not replace your Stacks wallet private key, but they can be used to authorize specific high-value actions.

- Your passkey public key is stored on-chain
- The signature verification happens entirely in the smart contract
- You can have one active passkey per wallet address
