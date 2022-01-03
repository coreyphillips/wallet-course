# Wallet-Course

### Installation
1. Clone wallet-course:
   - `git clone git@github.com:coreyphillips/wallet-course.git && cd wallet-course`

2. Install Dependencies & Build:
   - `npm i && npm run build`

3. Run tests:
   - `npm run test`

4. Run example project:
   - `ts-node wallet-project`


### Implementation
```
import { Wallet, generateMnemonic } from 'wallet-course';

// Generate a mnemonic phrase
const mnemonic = generateMnemonic();

// Create a wallet instance
const wallet = new Wallet({ mnemonic });

// Generate a bech32 receiving address at index 0
const address = wallet.getAddress({ addressType: 'p2wpkh', changeAddress: false, index: '0' });

// Get address balance
const balance = await wallet.getAddressBalance(address);
```
