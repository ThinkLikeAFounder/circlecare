# Contributing to CircleCare

## Welcome Contributors!

Thank you for your interest in contributing to CircleCare! This guide will help you get started with contributing to our care-centered expense sharing platform built on Stacks.

## Code of Conduct

### Our Pledge
We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Clarinet 2.x installed
- Git for version control
- Basic understanding of Clarity smart contracts
- Familiarity with TypeScript/React (for frontend contributions)

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/circlecare.git`
3. Install dependencies: `cd circlecare/contracts && npm install`
4. Run tests: `npm test`
5. Create a feature branch: `git checkout -b feature/your-feature-name`

## Types of Contributions

### 🐛 Bug Reports
- Use the bug report template
- Include steps to reproduce
- Provide expected vs actual behavior
- Include environment details (OS, Node version, etc.)

### ✨ Feature Requests
- Use the feature request template
- Explain the problem you're solving
- Describe your proposed solution
- Consider alternative solutions

### 📝 Documentation
- Fix typos and improve clarity
- Add examples and use cases
- Update outdated information
- Translate documentation

### 🔧 Code Contributions
- Smart contract improvements
- Frontend enhancements
- Test coverage improvements
- Performance optimizations

## Development Workflow

### 1. Issue Assignment
- Check existing issues before creating new ones
- Comment on issues you'd like to work on
- Wait for maintainer assignment before starting work
- Ask questions if requirements are unclear

### 2. Branch Naming
```
feature/issue-number-short-description
bugfix/issue-number-short-description
docs/issue-number-short-description
```

### 3. Commit Messages
Follow conventional commits format:
```
type(scope): description

feat(contracts): add expense expiration functionality
fix(frontend): resolve wallet connection issue
docs(api): update contract function documentation
test(treasury): add settlement validation tests
```

### 4. Pull Request Process
1. Ensure all tests pass
2. Update documentation if needed
3. Add tests for new functionality
4. Use the PR template
5. Request review from maintainers

## Smart Contract Guidelines

### Clarity Best Practices
- Use descriptive function and variable names
- Include comprehensive error handling
- Add inline documentation for complex logic
- Follow Clarity naming conventions (kebab-case)
- Optimize for gas efficiency

### Security Considerations
- Validate all inputs
- Use `unwrap!` and `try!` appropriately
- Implement proper access controls
- Consider reentrancy attacks
- Test edge cases thoroughly

### Example Contract Structure
```clarity
;; Title: Contract Name
;; Version: 1.0.0
;; Summary: Brief description
;; Description: Detailed explanation

;; Constants
(define-constant ERR_UNAUTHORIZED (err u401))
(define-constant ERR_NOT_FOUND (err u404))

;; Data Variables
(define-data-var contract-owner principal tx-sender)

;; Data Maps
(define-map circles uint {
  name: (string-ascii 50),
  creator: principal,
  created-at: uint
})

;; Public Functions
(define-public (create-circle (name (string-ascii 50)))
  ;; Implementation with proper validation
)

;; Read-Only Functions
(define-read-only (get-circle (circle-id uint))
  ;; Implementation
)

;; Private Functions
(define-private (validate-circle-name (name (string-ascii 50)))
  ;; Implementation
)
```

## Frontend Guidelines

### React/TypeScript Standards
- Use functional components with hooks
- Implement proper TypeScript types
- Follow React best practices
- Use consistent naming conventions
- Implement proper error boundaries

### Stacks.js Integration
```typescript
// Example contract interaction
import { openContractCall } from '@stacks/connect';

const createCircle = async (name: string) => {
  await openContractCall({
    contractAddress: CONTRACTS.CIRCLE_FACTORY.address,
    contractName: CONTRACTS.CIRCLE_FACTORY.name,
    functionName: 'create-circle',
    functionArgs: [stringAsciiCV(name)],
    onFinish: (data) => {
      console.log('Transaction submitted:', data.txId);
    }
  });
};
```

## Testing Requirements

### Smart Contract Tests
- Unit tests for all public functions
- Edge case testing
- Error condition validation
- Gas usage optimization tests

### Frontend Tests
- Component unit tests
- Integration tests for contract interactions
- E2E tests for critical user flows
- Accessibility testing

### Test Structure
```typescript
// contracts/tests/circle-factory.test.ts
import { describe, expect, it } from 'vitest';
import { Cl } from '@stacks/transactions';

describe('CircleFactory', () => {
  it('should create a new circle', () => {
    const { result } = simnet.callPublicFn(
      'circle-factory',
      'create-circle',
      [Cl.stringAscii('Test Circle')],
      address1
    );
    expect(result).toBeOk();
  });
});
```

## Documentation Standards

### Code Documentation
- Document all public functions
- Explain complex algorithms
- Include usage examples
- Keep documentation up-to-date

### API Documentation
```clarity
;; Creates a new care circle
;; @param name: Circle name (max 50 characters)
;; @returns: Circle ID on success, error code on failure
(define-public (create-circle (name (string-ascii 50)))
  ;; Implementation
)
```

## Review Process

### What We Look For
- Code quality and readability
- Test coverage and quality
- Documentation completeness
- Security considerations
- Performance implications

### Review Timeline
- Initial review within 48 hours
- Follow-up reviews within 24 hours
- Maintainer approval required for merge
- Automated checks must pass

## Release Process

### Version Numbering
We follow semantic versioning (SemVer):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Schedule
- Patch releases: As needed for critical bugs
- Minor releases: Monthly feature releases
- Major releases: Quarterly with breaking changes

## Community

### Communication Channels
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: General questions and ideas
- Discord: Real-time community chat
- Twitter: Updates and announcements

### Getting Help
- Check existing documentation first
- Search closed issues for similar problems
- Ask questions in GitHub Discussions
- Join our Discord for real-time help

## Recognition

### Contributors
All contributors are recognized in our README and release notes.

### Maintainers
Active contributors may be invited to become maintainers with additional responsibilities:
- Code review privileges
- Issue triage
- Release management
- Community moderation

## Legal

### License
By contributing, you agree that your contributions will be licensed under the MIT License.

### Contributor License Agreement
First-time contributors will be asked to sign our CLA to ensure we can use your contributions.

Thank you for contributing to CircleCare! Together, we're building the future of care-centered expense sharing. 🌟