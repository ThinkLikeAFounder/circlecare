# Frequently Asked Questions (FAQ)

## General Questions

### What is CircleCare?
CircleCare is a care-centered expense sharing platform built on the Stacks blockchain. Instead of tracking individual debts, it focuses on mutual care within communities, allowing groups to share expenses and support each other financially.

### How is CircleCare different from other expense sharing apps?
Traditional apps focus on "who owes whom" and debt tracking. CircleCare emphasizes **circles of mutual care** where everyone contributes when they can and receives when they need. It's built on blockchain for transparency and uses STX for settlements.

### Is CircleCare free to use?
The platform itself is free, but you'll pay small transaction fees in STX for blockchain operations like creating circles, adding expenses, and settling balances. These fees are typically less than $0.10 USD.

### Do I need cryptocurrency experience to use CircleCare?
No! While CircleCare uses STX (Stacks tokens), the interface is designed for everyday users. You just need a wallet and some STX tokens. Our user guide walks you through everything step-by-step.

## Getting Started

### What wallet do I need?
You can use any Stacks-compatible wallet:
- **Leather Wallet** (recommended) - Browser extension
- **Xverse** - Browser extension and mobile app
- **Boom Wallet** - Mobile-focused wallet
- Any wallet supporting Stacks Connect

### How do I get STX tokens?
- **Buy on exchanges**: Binance, Coinbase, Kraken, OKX
- **Testnet faucet**: For testing, use the [Hiro faucet](https://explorer.hiro.so/sandbox/faucet)
- **Earn STX**: Through Stacking (Stacks' consensus mechanism)

### Can I use CircleCare without owning STX?
You need some STX for transaction fees, but circle members can contribute to your balance if needed. The minimum amount needed is very small (usually less than 0.1 STX).

## Circles and Members

### How many people can be in a circle?
Each circle can have up to 20 members. This limit ensures efficient processing and manageable group dynamics.

### Can I be in multiple circles?
Yes! You can create and join as many circles as you want. Each circle operates independently with its own expenses and balances.

### Who can add members to a circle?
Only the circle creator (the person who created the circle) can add or remove members. This prevents unauthorized access and maintains circle integrity.

### Can I leave a circle?
Currently, only the circle creator can remove members. If you want to leave a circle, ask the creator to remove you, or settle your balance and stop participating.

### What happens if the circle creator becomes inactive?
This is a known limitation we're addressing in future updates. For now, choose trusted, active people as circle creators. We're developing governance features to handle inactive creators.

## Expenses and Settlements

### How are expenses split?
By default, expenses are split equally among all selected participants. For example, a $60 dinner among 3 people costs each person $20.

### Can I split expenses unequally?
Currently, CircleCare only supports equal splits. Unequal splitting is planned for a future update. For now, you can create multiple expenses to handle unequal shares.

### What's the maximum expense amount?
There's no hard limit, but practical limits depend on:
- Available STX in participants' wallets
- Circle treasury balance
- Network transaction limits

### How long do I have to settle expenses?
Expenses don't automatically expire unless you set an expiration date. However, it's good practice to settle regularly to maintain healthy circle relationships.

### Can I settle partial amounts?
Yes! You can make partial payments toward your balance. The system tracks your total balance across all expenses in the circle.

## Treasury and Balances

### What is a circle treasury?
The treasury is a shared pool of STX that circle members can contribute to. It can automatically cover expenses, reducing the need for individual settlements.

### How do treasury contributions work?
Members can voluntarily contribute STX to the circle treasury. These funds can be used to:
- Automatically settle expenses
- Cover members who are temporarily short on funds
- Build a buffer for future expenses

### Can I withdraw from the treasury?
Treasury withdrawals depend on circle governance. Currently, the circle creator manages treasury access. Future updates will include more sophisticated governance mechanisms.

### Why is my balance negative?
A negative balance means you owe money to the circle (you've benefited from more expenses than you've paid for). A positive balance means others owe you money.

### How often should I settle my balance?
There's no required frequency, but we recommend:
- Weekly for active circles with frequent expenses
- Monthly for casual circles
- Immediately for large expenses
- Before major events or trips

## Technical Questions

### Is my data private?
CircleCare operates on a public blockchain, so:
- **Public**: Circle names, expense descriptions, amounts, member addresses
- **Private**: Your personal information, wallet seed phrase, off-chain communications

### What happens if I lose my wallet?
If you lose access to your wallet:
- You lose access to your CircleCare circles
- Your balances and expense history remain on the blockchain
- Other members can see your participation but can't access your funds
- Always backup your wallet seed phrase securely!

### Can transactions be reversed?
No, blockchain transactions are irreversible. Always double-check:
- Recipient addresses
- Amounts
- Transaction details
Before confirming any transaction.

### What if the CircleCare website goes down?
Since CircleCare is built on blockchain:
- Your data remains accessible on the Stacks blockchain
- You can interact with contracts directly using other tools
- The open-source code allows anyone to create alternative interfaces
- Your funds are never locked in our platform

### How do I verify contract authenticity?
CircleCare uses Clarity 4's `contract-hash?` feature to verify contract integrity. You can also:
- Check contract addresses on Stacks Explorer
- Review the open-source code on GitHub
- Verify deployment transactions

## Troubleshooting

### My transaction is stuck or failed
**Common causes and solutions:**
- **Insufficient STX**: Ensure you have enough STX for fees
- **Network congestion**: Wait and try again later
- **Wrong network**: Verify you're on the correct network (testnet/mainnet)
- **Wallet issues**: Try refreshing or reconnecting your wallet

### I can't see my circle or expenses
**Troubleshooting steps:**
1. Wait 2-3 minutes for blockchain confirmation
2. Refresh the page
3. Check your wallet connection
4. Verify you're on the correct network
5. Check transaction status on Stacks Explorer

### Wallet won't connect
**Try these solutions:**
1. Refresh the page
2. Disable other wallet extensions temporarily
3. Clear browser cache and cookies
4. Try a different browser
5. Update your wallet extension

### Balance seems incorrect
**Verification steps:**
1. Review all expenses in the circle
2. Check if any settlements were missed
3. Verify treasury contributions
4. Wait for all transactions to confirm
5. Contact support if discrepancies persist

## Security and Safety

### How secure is CircleCare?
CircleCare uses multiple security layers:
- **Clarity 4 smart contracts** with built-in security features
- **Open-source code** for transparency and community review
- **Blockchain immutability** prevents tampering
- **Wallet-based authentication** (no passwords to hack)

### What are the main risks?
**Smart contract risks:**
- Bugs in contract code (mitigated by audits and testing)
- Network attacks (protected by Stacks security)

**User risks:**
- Lost wallet access (backup your seed phrase!)
- Sending to wrong addresses (always double-check)
- Phishing attacks (only use official CircleCare domains)

### How do I protect myself?
**Best practices:**
- Backup your wallet seed phrase securely
- Never share your seed phrase with anyone
- Verify all transaction details before signing
- Use hardware wallets for large amounts
- Keep wallet software updated
- Only use official CircleCare websites

### What if I suspect fraud?
**If you notice suspicious activity:**
1. Document the issue with screenshots
2. Check transaction details on Stacks Explorer
3. Report to the CircleCare team immediately
4. Consider pausing circle activity until resolved

## Future Development

### What new features are planned?
**Short-term (next 3-6 months):**
- Mobile app for iOS and Android
- Unequal expense splitting
- Enhanced treasury governance
- Improved user interface

**Medium-term (6-12 months):**
- Multi-token support (sBTC, other SIP-010 tokens)
- Passkey authentication
- Advanced analytics and reporting
- Cross-chain integrations

**Long-term (1+ years):**
- DAO governance
- Third-party API
- Advanced automation
- Enterprise features

### How can I contribute to development?
**Ways to get involved:**
- Report bugs and suggest features on GitHub
- Contribute code (see CONTRIBUTING.md)
- Help with documentation and translations
- Participate in community discussions
- Test new features and provide feedback

### Will CircleCare always be free?
The core platform will remain free and open-source. We may introduce optional premium features for power users or enterprises, but basic expense sharing will always be free (except for blockchain transaction fees).

## Support and Community

### How do I get help?
**Support channels:**
1. **Documentation**: Check this FAQ and user guide first
2. **GitHub Issues**: For bug reports and feature requests
3. **Discord**: Real-time community support
4. **Email**: support@circlecare.xyz for urgent issues
5. **Twitter**: @CircleCare_xyz for updates and announcements

### How do I report a bug?
**Bug reporting process:**
1. Check if the issue is already reported on GitHub
2. Gather information: browser, wallet, steps to reproduce
3. Create a detailed issue on GitHub
4. Include screenshots or error messages
5. Follow up on the issue for updates

### Can I suggest new features?
Absolutely! We welcome feature suggestions:
- Create a feature request on GitHub
- Join discussions in our Discord
- Participate in community calls
- Vote on existing feature requests

### How do I stay updated?
**Stay informed about CircleCare:**
- Follow @CircleCare_xyz on Twitter
- Join our Discord server
- Watch the GitHub repository
- Subscribe to our newsletter (coming soon)
- Check the blog for major updates

---

**Still have questions?** Join our community Discord or create an issue on GitHub. We're here to help! 🌟