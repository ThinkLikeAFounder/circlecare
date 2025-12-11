# CircleCare Deployment Guide

## Prerequisites

### System Requirements
- Node.js 18+ and npm/yarn
- Clarinet 2.x ([Installation Guide](https://docs.hiro.so/clarinet))
- Git for version control
- STX tokens for deployment fees

### Development Tools
- Code editor with Clarity syntax support
- Stacks wallet (Leather, Xverse, or compatible)
- Access to Stacks testnet/mainnet

## Environment Setup

### 1. Install Clarinet
```bash
# macOS
brew install clarinet

# Linux/Windows
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz | tar xz
```

### 2. Verify Installation
```bash
clarinet --version
# Should output: clarinet 2.x.x
```

### 3. Clone Repository
```bash
git clone https://github.com/ThinkLikeAFounder/circlecare.git
cd circlecare/contracts
```

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:report
```

### 3. Start Clarinet Console
```bash
clarinet console
```

### 4. Check Contract Syntax
```bash
clarinet check
```

## Testnet Deployment

### 1. Configure Testnet Settings
Edit `settings/Testnet.toml`:
```toml
[network]
name = "testnet"
node_rpc_address = "https://api.testnet.hiro.so"

[accounts.deployer]
mnemonic = "your testnet mnemonic here"
balance = 100000000000

[accounts.wallet_1]
mnemonic = "test wallet mnemonic"
balance = 100000000000
```

### 2. Generate Deployment Plan
```bash
clarinet deployments generate --testnet
```

### 3. Review Deployment Plan
Check `deployments/default.testnet-plan.yaml`:
```yaml
---
id: 0
name: CircleCare Testnet Deployment
network: testnet
stacks-node: "https://api.testnet.hiro.so"
bitcoin-node: "https://blockstream.info/testnet/api"
plan:
  batches:
    - id: 0
      transactions:
        - contract-publish:
            contract-name: circle-factory
            expected-sender: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 5340
            path: contracts/circle-factory.clar
        - contract-publish:
            contract-name: circle-treasury
            expected-sender: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 6420
            path: contracts/circle-treasury.clar
```

### 4. Deploy to Testnet
```bash
clarinet deployments apply --testnet
```

### 5. Verify Deployment
```bash
# Check contract deployment status
clarinet deployments check --testnet

# Interact with deployed contracts
clarinet console --testnet
```

## Mainnet Deployment

### 1. Security Checklist
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Code review approved
- [ ] Testnet deployment successful
- [ ] Documentation updated

### 2. Configure Mainnet Settings
Edit `settings/Mainnet.toml`:
```toml
[network]
name = "mainnet"
node_rpc_address = "https://api.hiro.so"

[accounts.deployer]
mnemonic = "your mainnet mnemonic here"
balance = 100000000000
```

### 3. Generate Mainnet Plan
```bash
clarinet deployments generate --mainnet
```

### 4. Deploy to Mainnet
```bash
# Final verification
clarinet check
clarinet test

# Deploy
clarinet deployments apply --mainnet
```

## Post-Deployment

### 1. Verify Contract Deployment
```bash
# Check on Stacks Explorer
# Testnet: https://explorer.hiro.so/txid/[transaction-id]?chain=testnet
# Mainnet: https://explorer.hiro.so/txid/[transaction-id]
```

### 2. Update Frontend Configuration
Update contract addresses in frontend configuration:
```typescript
// lib/contracts.ts
export const CONTRACTS = {
  CIRCLE_FACTORY: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.circle-factory',
  CIRCLE_TREASURY: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.circle-treasury'
};
```

### 3. Test Integration
- Create test circle
- Add test expense
- Perform test settlement
- Verify all functions work correctly

## Monitoring and Maintenance

### 1. Set Up Monitoring
- Contract call monitoring
- Error rate tracking
- Gas usage analysis
- User activity metrics

### 2. Regular Maintenance
- Monitor for security issues
- Update dependencies
- Performance optimization
- Bug fixes and improvements

## Troubleshooting

### Common Issues

#### Deployment Fails
```bash
# Check account balance
clarinet accounts

# Verify network connectivity
curl https://api.testnet.hiro.so/v2/info

# Check contract syntax
clarinet check
```

#### Transaction Fails
- Insufficient STX balance
- Network congestion
- Contract logic errors
- Invalid parameters

#### Contract Not Found
- Verify deployment transaction confirmed
- Check contract address spelling
- Ensure correct network (testnet vs mainnet)

### Getting Help
- [Clarinet Documentation](https://docs.hiro.so/clarinet)
- [Stacks Discord](https://discord.gg/stacks)
- [GitHub Issues](https://github.com/ThinkLikeAFounder/circlecare/issues)

## Rollback Procedures

### Emergency Rollback
1. Identify problematic deployment
2. Deploy previous stable version
3. Update frontend configuration
4. Notify users of temporary service interruption

### Planned Rollback
1. Schedule maintenance window
2. Backup current state
3. Deploy rollback version
4. Verify functionality
5. Update documentation

## Security Considerations

### Private Key Management
- Use hardware wallets for mainnet deployments
- Never commit private keys to version control
- Use environment variables for sensitive data
- Implement multi-signature for critical operations

### Contract Security
- Regular security audits
- Automated vulnerability scanning
- Penetration testing
- Bug bounty programs

### Access Control
- Limit deployment access to authorized personnel
- Use principle of least privilege
- Regular access reviews
- Audit logging for all deployments