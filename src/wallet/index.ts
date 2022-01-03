import * as bitcoin from 'bitcoinjs-lib';
import bip39 = require('bip39');
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { BIP32Interface } from 'bip32';
import {
	IConnectToElectrumRes,
	IGetAddress,
	IGetAddressBalanceRes,
	IWallet,
	TAvailableNetworks,
	TElectrumNetworks,
} from '../types';
import { Network } from 'bitcoinjs-lib';
import {
	getKeyDerivationPathString,
} from '../utils/derivation-path';
import { getScriptHash, validateMnemonic } from '../utils';
import tls from 'tls';
import { start, getAddressScriptHashBalance } from "rn-electrum-client/helpers";

const bip32 = BIP32Factory(ecc);

export class Wallet {
	private readonly mnemonic: string;
	private readonly passphrase: string;
	private readonly seed: Buffer;
	private readonly root: BIP32Interface;
	public network: TAvailableNetworks;
	public connectedToElectrum: boolean;
	constructor({ mnemonic, passphrase, network = 'bitcoin' }: IWallet) {
		if (!mnemonic) throw new Error('No mnemonic specified.');
		this.mnemonic = mnemonic;
		this.passphrase = passphrase ?? '';
		this.network = network;
		this.seed = bip39.mnemonicToSeedSync(this.mnemonic, this.passphrase);
		this.root = bip32.fromSeed(this.seed, this.getNetwork(network));
		this.connectedToElectrum = false;
	}

	/**
	 * Returns the Network object of the currently selected network (bitcoin or testnet).
	 * @param {TAvailableNetworks} [network]
	 * @return {Network}
	 */
	getNetwork(network?: TAvailableNetworks): Network {
		if (!network) {
			network = this.network;
		}
		return bitcoin.networks[network];
	}

	/**
	 * Returns the network string for use with Electrum methods.
	 * @param {TAvailableNetworks} [network]
	 * @return {TElectrumNetworks}
	 */
	getElectrumNetwork(network?: TAvailableNetworks): TElectrumNetworks {
		if (!network) {
			network = this.network;
		}
		return network === 'bitcoin' ? 'bitcoin' : 'bitcoinTestnet';
	}

	isValid(mnemonic): boolean {
		return mnemonic === this.mnemonic && validateMnemonic(mnemonic);
	}

	/**
	 * Returns a single Bitcoin address based on the provided address type,
	 * index and whether it is a change address.
	 * @param {TKeyDerivationIndex} [index]
	 * @param {boolean} [changeAddress]
	 * @param {TAddressType} [addressType]
	 */
	getAddress(
		{
			index = '0',
			changeAddress = false,
			addressType = 'p2wpkh'
		}: IGetAddress): string {
		try {
			const change = changeAddress ? '1' : '0';
			const path = getKeyDerivationPathString({ addressType, change, index });
			const keyPair = this.root.derivePath(path);
			switch (addressType) {
				case 'p2wpkh':
					//Get Bech32 (bc1) address
					return bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: this.getNetwork() })
						.address ?? '';
				case 'p2sh':
					//Get Segwit P2SH Address (3)
					return bitcoin.payments.p2sh({
						redeem: bitcoin.payments.p2wpkh({
							pubkey: keyPair.publicKey,
							network: this.getNetwork(),
						}),
						network: this.getNetwork(),
					}).address ?? '';
				//Get Legacy Address (1)
				case 'p2pkh':
					return bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: this.getNetwork() })
						.address ?? '';
			}
			return '';
		} catch {
			return '';
		}
	}

	async connectToElectrum(): Promise<IConnectToElectrumRes> {
		const electrumNetwork = this.getElectrumNetwork(this.network);
		const startResponse = await start({ network: electrumNetwork, tls });
		this.connectedToElectrum = startResponse.error;
		return { error: this.connectedToElectrum };
	}

	/**
	 * Returns the balance in sats for a given address.
	 * @param {string} address
	 * @return {number}
	 */
	async getAddressBalance(address: string): Promise<IGetAddressBalanceRes> {
		if (!this.connectedToElectrum) await this.connectToElectrum();
		const scriptHash = getScriptHash({ address, network: this.network });
		const network = this.network === 'bitcoin' ? 'bitcoin' : 'bitcoinTestnet';
		const response = await getAddressScriptHashBalance({ scriptHash, network });
		if (response.error) {
			return { error: response.error, confirmed: 0, unconfirmed: 0 };
		}
		const { confirmed, unconfirmed } = response.data;
		return { error: response.error, confirmed, unconfirmed };
	}
}
