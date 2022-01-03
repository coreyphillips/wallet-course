import bip39 = require('bip39');
import { TAvailableNetworks } from '../types';
import * as bitcoin from 'bitcoinjs-lib';
import { Network } from 'bitcoinjs-lib';

export const generateMnemonic = (): string => {
	return bip39.generateMnemonic();
};

export const validateMnemonic = (mnemonic = ''): boolean => {
	try {
		return bip39.validateMnemonic(mnemonic);
	} catch {
		return false;
	}
};

/**
 * Get scriptHash for a given address
 * @param {string} address
 * @param {TAvailableNetworks} network
 * @return {string}
 */
export const getScriptHash = ({
	address,
	network,
}: {
	address: string;
	network: TAvailableNetworks;
}): string => {
	try {
		const _network: Network = bitcoin.networks[network];
		const script = bitcoin.address.toOutputScript(address, _network);
		const hash = bitcoin.crypto.sha256(script);
		const reversedHash = Buffer.from(hash.reverse());
		return reversedHash.toString('hex');
	} catch {
		return '';
	}
};
