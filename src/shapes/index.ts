import { IAddressType } from "../types";

export const addressTypes: IAddressType = {
	p2pkh: {
		path: "m/44'/0'/0'/0/0",
		type: 'p2pkh',
		label: 'legacy',
	},
	p2sh: {
		path: "m/49'/0'/0'/0/0",
		type: 'p2sh',
		label: 'segwit',
	},
	p2wpkh: {
		path: "m/84'/0'/0'/0/0",
		type: 'p2wpkh',
		label: 'bech32',
	},
};
