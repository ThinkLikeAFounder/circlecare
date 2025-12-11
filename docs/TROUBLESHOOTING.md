# CircleCare Troubleshooting Guide

## Quick Diagnostic Checklist

Before diving into specific issues, run through this quick checklist:

- [ ] Wallet is connected and on the correct network
- [ ] Sufficient STX balance for transaction fees
- [ ] Browser is supported (Chrome, Firefox, Safari, Edge)
- [ ] No other wallet extensions interfering
- [ ] CircleCare website is the official domain
- [ ] Internet connection is stable

## Wallet Connection Issues

### Problem: Wallet Won't Connect

**Symptoms:**
- "Connect Wallet" button doesn't respond
- Wallet popup doesn't appear
- Connection fails immediately

**Solutions:**

1. **Check Wallet Extension**
   ```
   - Ensure wallet extension is installed and enabled
   - Try clicking the wallet icon in browser toolbar
   - Update wallet extension to latest version
   ```

2. **Browser Troubleshooting**
   ```
   - Refresh the page (Ctrl+F5 or Cmd+Shift+R)
   - Clear browser cache and cookies
   - Disable other wallet extensions temporarily
   - Try incognito/private browsing mode
   ```

3. **Network Issues**
   ```
   - Check if you're on correct network (testnet/mainnet)
   - Switch networks in wallet settings
   - Restart wallet extension
   ```

### Problem: Wallet Connects But Shows Wrong Address

**Symptoms:**
- Connected but showing different address than expected
- Multiple accounts in wallet

**Solutions:**

1. **Account Selection**
   ```
   - Check which account is active in your wallet
   - Switch to correct account in wallet settings
   - Disconnect and reconnect with correct account
   ```

2. **Wallet Reset**
   ```
   - Lock and unlock your wallet
   - Clear wallet cache if option available
   - Reimport wallet if necessary (have seed phrase ready!)
   ```

## Transaction Issues

### Problem: Transaction Fails or Gets Stuck

**Symptoms:**
- Transaction pending for long time
- "Transaction failed" error message
- Transaction disappears from pending

**Diagnostic Steps:**

1. **Check Transaction Status**
   ```
   - Copy transaction ID (txid) from wallet
   - Visit Stacks Explorer: https://explorer.hiro.so
   - Search for your transaction ID
   - Check status: pending, confirmed, or failed
   ```

2. **Verify Account Balance**
   ```
   - Ensure sufficient STX for transaction fees
   - Check if funds are locked in other transactions
   - Minimum recommended balance: 0.1 STX
   ```

**Solutions:**

1. **For Pending Transactions**
   ```
   - Wait 10-15 minutes for network confirmation
   - Check network status: https://status.hiro.so
   - Avoid submitting duplicate transactions
   ```

2. **For Failed Transactions**
   ```
   - Check error message in Stacks Explorer
   - Verify contract function parameters
   - Ensure you have required permissions
   - Try transaction again with higher fee
   ```

3. **For Stuck Transactions**
   ```
   - Wait for network congestion to clear
   - Check if nonce conflicts exist
   - Contact wallet support for nonce reset
   ```

### Problem: Insufficient Funds Error

**Symptoms:**
- "Insufficient funds" error when trying to transact
- Transaction rejected by wallet

**Solutions:**

1. **Check STX Balance**
   ```
   - Verify balance in wallet
   - Account for transaction fees (usually 0.001-0.01 STX)
   - Get more STX from exchange or faucet (testnet)
   ```

2. **Fee Calculation**
   ```
   - Circle creation: ~0.005 STX
   - Expense creation: ~0.003 STX
   - Settlement: ~0.008 STX
   - Member operations: ~0.002 STX
   ```

## Circle Management Issues

### Problem: Can't Create Circle

**Symptoms:**
- Circle creation fails
- Error message during creation
- Transaction succeeds but circle doesn't appear

**Diagnostic Steps:**

1. **Verify Inputs**
   ```
   - Circle name: 1-50 characters, ASCII only
   - No special characters or emojis
   - Name not already taken by you
   ```

2. **Check Permissions**
   ```
   - Wallet connected and unlocked
   - Sufficient STX balance
   - Not exceeding circle limit (50 per user)
   ```

**Solutions:**

1. **Input Validation**
   ```
   - Use simple, descriptive names
   - Avoid special characters: !@#$%^&*()
   - Try shorter names if having issues
   ```

2. **Network Issues**
   ```
   - Wait for previous transactions to confirm
   - Check network congestion
   - Try again in a few minutes
   ```

### Problem: Can't Add Members

**Symptoms:**
- "Add Member" button disabled
- Member addition fails
- Error when entering member address

**Solutions:**

1. **Verify Permissions**
   ```
   - Only circle creator can add members
   - Check if you created this circle
   - Verify wallet address matches creator
   ```

2. **Address Validation**
   ```
   - Stacks addresses start with 'ST' (mainnet) or 'ST' (testnet)
   - Address format: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
   - Copy-paste to avoid typos
   - Verify address on Stacks Explorer
   ```

3. **Circle Limits**
   ```
   - Maximum 20 members per circle
   - Member not already in circle
   - Valid Stacks principal address
   ```

## Expense and Balance Issues

### Problem: Expenses Not Appearing

**Symptoms:**
- Created expense but it's not visible
- Expense appears in some views but not others
- Balance calculations seem wrong

**Diagnostic Steps:**

1. **Transaction Confirmation**
   ```
   - Check if expense creation transaction confirmed
   - Look up transaction on Stacks Explorer
   - Wait 2-3 minutes for blockchain confirmation
   ```

2. **Data Refresh**
   ```
   - Refresh browser page
   - Clear browser cache
   - Check different browser or device
   ```

**Solutions:**

1. **Wait for Confirmation**
   ```
   - Blockchain transactions take time to confirm
   - Typical confirmation: 1-3 minutes
   - Network congestion can cause delays
   ```

2. **Verify Circle Membership**
   ```
   - Ensure you're a member of the circle
   - Check if you were removed from circle
   - Verify correct circle selected
   ```

### Problem: Incorrect Balance Calculations

**Symptoms:**
- Balance doesn't match expected amount
- Discrepancies between displayed and actual balance
- Settlement amounts seem wrong

**Diagnostic Steps:**

1. **Manual Calculation**
   ```
   - List all expenses you've paid
   - List all expenses you've participated in
   - Calculate your share of each expense
   - Compare with displayed balance
   ```

2. **Transaction History Review**
   ```
   - Check all transactions on Stacks Explorer
   - Verify expense amounts and participants
   - Look for missed or duplicate transactions
   ```

**Solutions:**

1. **Data Synchronization**
   ```
   - Refresh page and wait for data to load
   - Check if all transactions have confirmed
   - Clear browser cache and reload
   ```

2. **Contact Support**
   ```
   - Document the discrepancy with screenshots
   - Provide transaction IDs for review
   - Include circle ID and member addresses
   ```

## Network and Performance Issues

### Problem: Slow Loading or Timeouts

**Symptoms:**
- Pages load slowly or not at all
- Timeout errors
- Intermittent connectivity issues

**Solutions:**

1. **Network Diagnostics**
   ```
   - Check internet connection stability
   - Try different network (mobile hotspot)
   - Disable VPN if using one
   ```

2. **Browser Optimization**
   ```
   - Close unnecessary browser tabs
   - Disable resource-heavy extensions
   - Clear browser cache and cookies
   - Try different browser
   ```

3. **Stacks Network Status**
   ```
   - Check https://status.hiro.so for network issues
   - Monitor @Stacks on Twitter for updates
   - Try again during off-peak hours
   ```

### Problem: High Transaction Fees

**Symptoms:**
- Wallet shows unexpectedly high fees
- Fees much higher than usual
- Can't afford transaction fees

**Solutions:**

1. **Fee Optimization**
   ```
   - Wait for network congestion to decrease
   - Use lower priority if wallet allows
   - Batch multiple operations together
   ```

2. **Network Timing**
   ```
   - Avoid peak usage times
   - Monitor fee trends over time
   - Consider waiting for better conditions
   ```

## Browser and Device Issues

### Problem: Mobile Browser Issues

**Symptoms:**
- Features don't work on mobile
- Wallet connection fails on mobile
- UI elements not responsive

**Solutions:**

1. **Mobile Browser Compatibility**
   ```
   - Use Chrome or Safari on mobile
   - Enable desktop mode if needed
   - Update browser to latest version
   ```

2. **Mobile Wallet Integration**
   ```
   - Use mobile wallet apps (Xverse, Boom)
   - Enable WalletConnect if available
   - Try desktop browser for complex operations
   ```

### Problem: Browser Extension Conflicts

**Symptoms:**
- Multiple wallet popups appear
- Wrong wallet connects
- Inconsistent behavior

**Solutions:**

1. **Extension Management**
   ```
   - Disable unused wallet extensions
   - Set preferred wallet as default
   - Clear extension data and reconfigure
   ```

2. **Browser Profile Isolation**
   ```
   - Create separate browser profile for CircleCare
   - Use incognito mode for testing
   - Install only necessary extensions
   ```

## Data and Privacy Issues

### Problem: Data Not Syncing Across Devices

**Symptoms:**
- Different data on different devices
- Missing circles or expenses
- Inconsistent balances

**Solutions:**

1. **Blockchain Data Consistency**
   ```
   - All data is stored on blockchain
   - Differences usually due to caching
   - Refresh both devices and compare
   ```

2. **Wallet Synchronization**
   ```
   - Ensure same wallet account on both devices
   - Check wallet backup and restore
   - Verify network settings match
   ```

### Problem: Privacy Concerns

**Symptoms:**
- Worried about data visibility
- Concerns about transaction privacy
- Questions about information sharing

**Information:**

1. **Public Blockchain Data**
   ```
   - Circle names and descriptions are public
   - Transaction amounts and addresses are visible
   - No personal information is required or stored
   ```

2. **Privacy Best Practices**
   ```
   - Use generic circle names if privacy is important
   - Consider using separate wallet for CircleCare
   - Understand blockchain transparency before using
   ```

## Emergency Procedures

### Problem: Suspected Security Breach

**Symptoms:**
- Unauthorized transactions
- Wallet compromised
- Suspicious activity in circles

**Immediate Actions:**

1. **Secure Your Wallet**
   ```
   - Change wallet password immediately
   - Transfer funds to new wallet if possible
   - Revoke all app permissions
   ```

2. **Document Evidence**
   ```
   - Screenshot suspicious transactions
   - Record transaction IDs
   - Note timestamps and amounts
   ```

3. **Report Incident**
   ```
   - Contact CircleCare support immediately
   - Report to wallet provider
   - Consider reporting to relevant authorities
   ```

### Problem: Lost Wallet Access

**Symptoms:**
- Can't access wallet
- Forgot password or lost device
- Seed phrase not working

**Recovery Steps:**

1. **Wallet Recovery**
   ```
   - Use seed phrase to restore wallet
   - Try different wallet applications
   - Contact wallet support for help
   ```

2. **CircleCare Impact**
   ```
   - Your circles and balances remain on blockchain
   - Other members can still see your participation
   - You cannot create new transactions without wallet access
   ```

3. **Prevention for Future**
   ```
   - Backup seed phrase securely
   - Use hardware wallet for large amounts
   - Consider multi-signature setups
   ```

## Getting Additional Help

### Self-Service Resources
1. **Documentation Review**
   - User Guide: Complete usage instructions
   - FAQ: Common questions and answers
   - API Reference: Technical details

2. **Community Resources**
   - GitHub Issues: Bug reports and discussions
   - Discord: Real-time community support
   - Twitter: Updates and announcements

### Professional Support
1. **Bug Reports**
   - Create detailed GitHub issue
   - Include reproduction steps
   - Provide system information

2. **Technical Support**
   - Email: support@circlecare.xyz
   - Include relevant transaction IDs
   - Describe problem in detail

3. **Emergency Contact**
   - For security issues: security@circlecare.xyz
   - For urgent problems: Use Discord @admin
   - For media inquiries: press@circlecare.xyz

### Information to Provide When Seeking Help

**Always Include:**
- Operating system and version
- Browser type and version
- Wallet type and version
- Network (testnet/mainnet)
- Steps to reproduce the issue
- Error messages (exact text)
- Screenshots if relevant
- Transaction IDs if applicable

**Never Share:**
- Wallet seed phrases
- Private keys
- Passwords
- Personal financial information

---

**Remember:** Most issues resolve themselves with time and patience. When in doubt, wait a few minutes and try again. The blockchain is resilient, and your data is safe even if the interface is temporarily unresponsive.