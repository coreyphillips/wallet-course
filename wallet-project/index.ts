import { Wallet } from '../';

//const mnemonic = generateMnemonic();
const mnemonic = 'vacuum bounce neither display chaos owner nest search honey able bind best';
const wallet = new Wallet({ mnemonic, network: 'testnet' });
const address = wallet.getAddress({});
console.log(address);
wallet.getAddressBalance(address).then((data) => {
	console.log(data);
});
