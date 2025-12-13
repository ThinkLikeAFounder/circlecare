# CircleCare - Next Generation Care Circles on Stacks

**A complete rebuild leveraging Clarity 4 features for enhanced security, performance, and user experience**

[![Clarity Version](https://img.shields.io/badge/Clarity-4.0-blue.svg)](https://docs.stacks.co/whats-new/clarity-4-is-now-live)
[![Stacks](https://img.shields.io/badge/Built%20on-Stacks-5546FF.svg)](https://www.stacks.co/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Overview

CircleCare transforms expense sharing from tracking debts into flowing care. Instead of "you owe Alice $50," we recognize that communities operate in **circles of mutual care**—everyone contributes when they can, everyone receives when they need, and support comes full circle.

This is a **ground-up rebuild** of CircleCare, architected from the start to leverage **Clarity 4's powerful new features** including:
- `contract-hash?` for contract integrity verification
- `restrict-assets?` for enhanced asset protection
- `to-ascii?` for improved data serialization
- `stacks-block-time` for time-based logic
- `secp256r1-verify` for passkey authentication readiness

## Why This Rebuild?

The original CircleCare prototype demonstrated the concept. This rebuild takes it to production-ready standards:

### Smart Contract Improvements (Clarity 4)
- **Enhanced Security**: Leveraging `restrict-assets?` to prevent unauthorized asset movements
- **Contract Verification**: Using `contract-hash?` to ensure contract integrity
- **Time-Based Features**: Implementing `stacks-block-time` for expiring expenses and automated settlements
- **Better Data Handling**: Using `to-ascii?` for improved serialization and cross-chain readiness
- **Future-Ready Auth**: Foundation laid for `secp256r1-verify` passkey authentication

### Frontend Modernization
- **Complete UI Redesign**: Fresh color palette while maintaining CircleCare's warm, flowing philosophy
- **Enhanced UX**: Improved wallet connection, transaction feedback, and error handling
- **Performance Optimizations**: Better state management and data fetching strategies
- **Accessibility**: WCAG 2.1 AA compliance from the ground up
- **Mobile-First**: Responsive design optimized for all device sizes

## Project Structure

```
circlecare/
├── contracts/                   # Clarity 4 smart contracts
│   ├── contracts/
│   │   ├── circle-factory.clar     # Circle creation and management
│   │   └── circle-treasury.clar    # Expense and settlement logic
│   ├── tests/                      # Comprehensive contract tests
│   └── Clarinet.toml               # Clarity 4 configuration
│
├── frontend/                    # Next.js 15 application
│   ├── app/                     # App router pages
│   ├── components/              # Reusable UI components
│   ├── lib/                     # Contract interactions & utilities
│   └── types/                   # TypeScript definitions
│
└── docs/                        # Documentation
    ├── ARCHITECTURE.md          # Technical architecture
    ├── CLARITY_4_FEATURES.md    # How we use Clarity 4
    └── DEPLOYMENT.md            # Deployment guide
```

## Tech Stack

### Smart Contracts
- **Clarity 4**: Latest version with enhanced features
- **Clarinet 2.x**: Development and testing framework
- **Vitest**: Unit testing with clarinet-sdk

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React features
- **TypeScript 5.x**: Type safety throughout
- **Tailwind CSS 4**: Modern utility-first CSS
- **Stacks.js**: Web3 integration
- **TanStack Query**: Data fetching and caching

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Clarinet 2.x ([Installation Guide](https://docs.hiro.so/clarinet))
- A Stacks wallet (Leather, Xverse, or compatible)
- STX on testnet ([Get from faucet](https://explorer.hiro.so/sandbox/faucet))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ThinkLikeAFounder/circlecare.git
   cd circlecare
   ```

2. **Install contract dependencies**
   ```bash
   cd contracts
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Development

**Smart Contracts**
```bash
cd contracts
clarinet test              # Run contract tests
clarinet console           # Interactive REPL
clarinet check             # Syntax checking
```

**Frontend**
```bash
cd frontend
npm run dev                # Start development server
npm run build              # Production build
npm run type-check         # TypeScript validation
```

## Clarity 4 Feature Implementation

### 1. Contract Integrity Verification (`contract-hash?`)
We use `contract-hash?` to verify that interacting contracts match expected implementations, preventing malicious contract substitution.

### 2. Asset Protection (`restrict-assets?`)
Settlement operations are wrapped with `restrict-assets?` to ensure:
- Users can only transfer amounts they actually owe
- Contract funds remain protected during external calls
- Automatic rollback on unauthorized transfers

### 3. Time-Based Logic (`stacks-block-time`)
Expenses can now have:
- Expiration timestamps for automatic resolution
- Time-locked settlements
- Scheduled recurring contributions

### 4. Enhanced Serialization (`to-ascii?`)
Convert principals, amounts, and other data to ASCII for:
- Human-readable expense receipts
- Better logging and events (principals and amounts in ASCII)
- Cross-chain message formatting
- Readable settlement types

### 5. Passkey Authentication (`secp256r1-verify`)
Complete implementation of secure, passwordless access:
- Register passkeys (TouchID, FaceID, YubiKey)
- Verify signatures for critical operations
- Optional passkey requirement for circles
- Multi-signature settlement support

## Key Features

### For Users
- **Create Care Circles**: Organize your community
- **Track Contributions**: Transparent expense sharing
- **Settle Debts**: Simple STX transfers
- **Time-Based Expenses**: Set expiration dates
- **Verified Contracts**: Know you're interacting with authentic code

### For Developers
- **Clarity 4 Native**: Built for the latest Clarity features
- **Comprehensive Tests**: Full test coverage
- **Type-Safe**: TypeScript throughout the stack
- **Well-Documented**: Clear code and documentation
- **Extensible**: Easy to build on top of

## Testing

### Smart Contracts
```bash
cd contracts
npm test                   # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Frontend
```bash
cd frontend
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
```

## Deployment

### Smart Contracts
See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

```bash
cd contracts
clarinet deployments generate --testnet
clarinet deployments apply --testnet
```

### Frontend
Deploy to Vercel, Netlify, or any static hosting:
```bash
cd frontend
npm run build
```

## Documentation

Comprehensive documentation is available in the `/docs` directory:

### 📚 Complete Documentation
- **[Documentation Hub](docs/README.md)** - Start here for all documentation

### 🚀 User Resources
- **[User Guide](docs/USER_GUIDE.md)** - Complete usage instructions
- **[FAQ](docs/FAQ.md)** - Frequently asked questions
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

### 🏗️ Developer Resources
- **[Architecture](docs/ARCHITECTURE.md)** - System architecture and design
- **[API Reference](docs/API.md)** - Complete contract API documentation
- **[Clarity 4 Features](docs/CLARITY_4_FEATURES.md)** - How we leverage Clarity 4
- **[Contributing](docs/CONTRIBUTING.md)** - Development guidelines and standards
- **[Deployment](docs/DEPLOYMENT.md)** - Deployment and infrastructure guide

### 🔧 Technical Resources
- **[TypeScript Types](types/contracts.ts)** - Complete type definitions
- **[Contract Tests](contracts/tests/)** - Comprehensive test suite
- **[Contract Documentation](contracts/contracts/)** - Inline code documentation

## Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for detailed guidelines:

1. Check existing issues or create a new one
2. Fork the repository
3. Create a feature branch
4. Make your changes with tests
5. Submit a pull request

For quick contributions:
- 🐛 **Bug Reports**: Use GitHub Issues
- 💡 **Feature Requests**: Create detailed GitHub Issues
- 📝 **Documentation**: Improve our docs
- 🔧 **Code**: Follow our development guidelines

## Roadmap

### Phase 1: Foundation (Current)
- [ ] Core Clarity 4 contracts with all new features
- [ ] Modern frontend with improved UX
- [ ] Comprehensive test coverage
- [ ] Documentation

### Phase 2: Enhanced Features
- [ ] Recurring contributions
- [ ] Multi-token support (sBTC, other SIP-010 tokens)
- [ ] Passkey authentication using `secp256r1-verify`
- [ ] Mobile app (React Native)

### Phase 3: Advanced
- [ ] Cross-chain bridges
- [ ] DAO governance
- [ ] Analytics dashboard
- [ ] API for third-party integrations

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- Built on [Stacks](https://www.stacks.co/) - Bitcoin Layer 2
- Powered by [Clarity 4](https://docs.stacks.co/whats-new/clarity-4-is-now-live)
- Developed for [Talent Protocol Builder Challenge](https://talentprotocol.com/)

## Support & Community

### 📖 Documentation & Help
- **[Complete Documentation](docs/README.md)** - All guides and references
- **[User Guide](docs/USER_GUIDE.md)** - Get started with CircleCare
- **[FAQ](docs/FAQ.md)** - Quick answers to common questions
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Solve issues quickly

### 🤝 Community & Support
- **[Discord](https://discord.gg/circlecare)** - Real-time community support
- **[GitHub Issues](https://github.com/ThinkLikeAFounder/circlecare/issues)** - Bug reports and feature requests
- **[GitHub Discussions](https://github.com/ThinkLikeAFounder/circlecare/discussions)** - Community discussions
- **[Twitter @CircleCare_xyz](https://twitter.com/circlecare_xyz)** - Updates and announcements

### 🛠️ Developer Resources
- **[API Documentation](docs/API.md)** - Contract interfaces and examples
- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design and components
- **[Contributing Guide](docs/CONTRIBUTING.md)** - How to contribute code
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Setup and deployment instructions

---

**CircleCare** - Where care comes full circle, powered by Clarity 4 on Stacks
