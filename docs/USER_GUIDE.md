# CircleCare User Guide

## Welcome to CircleCare! 🌟

CircleCare transforms expense sharing from tracking debts into flowing care. Instead of "you owe Alice $50," we recognize that communities operate in circles of mutual care—everyone contributes when they can, everyone receives when they need, and support comes full circle.

## Getting Started

### What You'll Need
- A Stacks wallet (Leather, Xverse, or compatible)
- STX tokens for transactions
- Web browser (Chrome, Firefox, Safari, or Edge)

### Setting Up Your Wallet

#### Option 1: Leather Wallet (Recommended)
1. Install [Leather Wallet](https://leather.io/) browser extension
2. Create a new wallet or import existing one
3. Switch to Stacks Testnet for testing
4. Get test STX from the [faucet](https://explorer.hiro.so/sandbox/faucet)

#### Option 2: Xverse Wallet
1. Install [Xverse](https://www.xverse.app/) browser extension
2. Set up your wallet following their guide
3. Ensure you're on the correct network (testnet/mainnet)

### Connecting to CircleCare
1. Visit the CircleCare application
2. Click "Connect Wallet" in the top right
3. Select your wallet provider
4. Approve the connection request
5. You're ready to start using CircleCare!

## Core Concepts

### Care Circles
A care circle is a group of people who share expenses and support each other financially. Unlike traditional expense splitting apps that focus on debts, CircleCare emphasizes mutual care and community support.

### Expenses
Expenses are shared costs within a circle. When someone pays for something that benefits the group, they can add it as an expense to be shared among participants.

### Settlements
Settlements are the process of balancing expenses within a circle. Instead of individual debt tracking, CircleCare calculates net balances and facilitates efficient transfers.

### Treasury
Each circle has a shared treasury where members can contribute STX. This creates a pool of funds for future expenses and reduces the need for individual settlements.

## Using CircleCare

### Creating Your First Circle

1. **Click "Create Circle"**
   - Enter a descriptive name (e.g., "Roommate Expenses", "Family Vacation")
   - Names can be up to 50 characters

2. **Confirm Transaction**
   - Your wallet will prompt you to sign the transaction
   - Pay the small STX fee (usually less than 0.01 STX)
   - Wait for confirmation (usually 1-2 minutes)

3. **Circle Created!**
   - You'll see your new circle in the dashboard
   - You're automatically the circle creator with admin privileges

### Adding Members to Your Circle

1. **Open Your Circle**
   - Click on the circle name from your dashboard

2. **Add Members**
   - Click "Add Member" button
   - Enter the member's Stacks address (starts with ST...)
   - Confirm the transaction

3. **Member Permissions**
   - All members can create expenses
   - All members can contribute to treasury
   - Only you (creator) can add/remove members

### Creating Expenses

1. **Navigate to Your Circle**
   - Select the circle from your dashboard

2. **Click "Add Expense"**
   - Enter expense amount (in STX)
   - Add a clear description (e.g., "Grocery shopping", "Dinner at restaurant")
   - Select which members should share this expense

3. **Confirm Details**
   - Review the expense details
   - The cost will be split equally among selected participants
   - Sign the transaction to create the expense

### Understanding Your Balance

Your balance in a circle shows:
- **Positive Balance**: Others owe you money
- **Negative Balance**: You owe money to the circle
- **Zero Balance**: You're all settled up!

The balance is calculated from:
- Expenses you've paid for others
- Your share of expenses others have paid
- Contributions to/from the circle treasury

### Settling Expenses

#### Individual Settlement
1. **View Your Balance**
   - Check your circle dashboard for current balance

2. **Settle Up**
   - Click "Settle Balance" if you owe money
   - Enter the amount you want to pay
   - Confirm the STX transfer

#### Automatic Settlement
CircleCare can automatically settle expenses when:
- An expense is created and you have sufficient treasury balance
- Time-based settlements are configured
- All participants agree to auto-settlement

### Contributing to Circle Treasury

1. **Open Circle Treasury**
   - Click "Treasury" tab in your circle

2. **Make Contribution**
   - Enter STX amount to contribute
   - Add optional note about the contribution
   - Confirm transaction

3. **Benefits of Treasury**
   - Reduces need for individual settlements
   - Enables automatic expense coverage
   - Creates shared financial buffer

## Advanced Features

### Time-Based Expenses
Set expiration dates for expenses:
- Automatic resolution after deadline
- Prevents old expenses from accumulating
- Helps maintain active circle participation

### Recurring Contributions
Set up regular contributions to circle treasury:
- Monthly rent or utilities
- Weekly grocery allowances
- Vacation savings goals

### Expense Categories
Organize expenses by type:
- Food & Dining
- Transportation
- Entertainment
- Utilities
- Shopping

## Best Practices

### Circle Management
- **Clear Names**: Use descriptive circle names
- **Active Members**: Only add people who regularly participate
- **Regular Check-ins**: Review balances weekly or monthly
- **Communication**: Discuss major expenses before adding them

### Expense Tracking
- **Detailed Descriptions**: Help members understand what they're paying for
- **Timely Entry**: Add expenses soon after they occur
- **Fair Participation**: Include all relevant members in shared expenses
- **Receipt Photos**: Keep receipts for reference (off-chain)

### Financial Health
- **Regular Settlements**: Don't let balances grow too large
- **Treasury Contributions**: Maintain a reasonable treasury balance
- **Budget Awareness**: Discuss spending limits with your circle
- **Emergency Fund**: Consider keeping extra STX for unexpected expenses

## Troubleshooting

### Common Issues

#### Wallet Connection Problems
- **Issue**: Wallet won't connect
- **Solution**: 
  - Refresh the page and try again
  - Check if wallet extension is enabled
  - Ensure you're on the correct network
  - Try a different browser

#### Transaction Failures
- **Issue**: Transaction doesn't complete
- **Solution**:
  - Check STX balance for fees
  - Wait for network congestion to clear
  - Increase gas fee if wallet allows
  - Contact support if problem persists

#### Missing Expenses or Balances
- **Issue**: Expenses don't appear or balances are wrong
- **Solution**:
  - Wait a few minutes for blockchain confirmation
  - Refresh the page
  - Check transaction on Stacks Explorer
  - Verify you're in the correct circle

#### Member Addition Issues
- **Issue**: Can't add new members
- **Solution**:
  - Verify you're the circle creator
  - Check the member's Stacks address is correct
  - Ensure member isn't already in the circle
  - Check if circle has reached member limit (20 max)

### Getting Help

#### Self-Service Resources
- Check this user guide
- Review the FAQ section
- Search previous issues on GitHub
- Check Stacks Explorer for transaction status

#### Community Support
- Join our Discord server
- Ask questions in GitHub Discussions
- Follow @CircleCare_xyz on Twitter
- Email support@circlecare.xyz

#### Reporting Bugs
1. Check if the issue is already reported
2. Gather relevant information:
   - Browser and version
   - Wallet type and version
   - Steps to reproduce
   - Error messages or screenshots
3. Create a detailed bug report on GitHub

## Security & Privacy

### Your Data
- Circle names and expense descriptions are public on blockchain
- Member addresses are visible to all circle participants
- Transaction amounts and timestamps are publicly viewable
- No personal information is required or stored

### Protecting Your Funds
- Never share your wallet seed phrase
- Always verify transaction details before signing
- Use hardware wallets for large amounts
- Keep your wallet software updated

### Smart Contract Security
- Contracts are open source and audited
- Funds are protected by Clarity 4 security features
- Emergency pause functionality exists for critical issues
- Regular security updates and monitoring

## Tips for Success

### Building Strong Circles
- **Start Small**: Begin with close friends or family
- **Set Expectations**: Discuss spending habits and limits
- **Regular Communication**: Keep everyone informed about expenses
- **Fair Participation**: Ensure everyone contributes appropriately

### Maximizing Benefits
- **Use Treasury**: Maintain a shared balance for convenience
- **Batch Settlements**: Settle multiple expenses at once
- **Plan Ahead**: Discuss upcoming shared expenses
- **Track Trends**: Monitor spending patterns over time

### Community Building
- **Share the Love**: Invite others to join CircleCare
- **Provide Feedback**: Help us improve the platform
- **Contribute**: Consider contributing to the open source project
- **Spread Awareness**: Share your positive experiences

## What's Next?

### Upcoming Features
- Mobile app for iOS and Android
- Multi-token support (sBTC, other SIP-010 tokens)
- Enhanced analytics and reporting
- Passkey authentication for easier access

### Community Roadmap
- DAO governance for platform decisions
- Cross-chain bridge integrations
- Third-party API for developers
- Advanced automation features

### Getting Involved
- Join our community Discord
- Follow development on GitHub
- Participate in governance discussions
- Contribute code or documentation

---

Welcome to the CircleCare community! We're excited to have you join us in building the future of care-centered expense sharing. If you have any questions or feedback, don't hesitate to reach out. Together, we're making financial collaboration more caring and community-focused. 💙