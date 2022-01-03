import { generateMnemonic } from '../src';

import * as chai from 'chai';
import { validateMnemonic } from 'bip39';
import { Wallet } from '../';

const expect = chai.expect;

const mnemonic = 'decorate grass round powder swarm syrup identify resemble mass online grunt cruise';
const wallet: Wallet = new Wallet({ mnemonic, network: 'testnet' });


describe('Wallet Library', () => {

	it('Should generate a valid, random mnemonic' , () => {
		const randomMnemonic = generateMnemonic();
		expect(validateMnemonic(randomMnemonic)).to.equal(true);
	});

	it('Should determine that the current wallet instance is invalid' , () => {
		const invalidMnemonic = 'corn core humor loud lady wealth avoid purse next subject focus dilemma';
		const isValid = wallet.isValid(invalidMnemonic);
		expect(isValid).to.equal(false);
	});

	it('Should determine that the current wallet instance is valid' , () => {
		const isValid = wallet.isValid(mnemonic);
		expect(isValid).to.equal(true);
	});

	it ('Should generate a bech32 receiving address at index 0', () => {
		const address = wallet.getAddress({ addressType: 'p2wpkh', changeAddress: false, index: '0' });
		expect(address).to.equal('tb1qreygjcarrm68vjg4fkx04qj70g04c5ttczj96p');
	});

	it ('Should generate a segwit change address at index 1', () => {
		const address = wallet.getAddress({ addressType: 'p2sh', changeAddress: true, index: '1' });
		expect(address).to.equal('2NBPJBFTWRJpPygU5m99j1KKgXuZLjAjAkL');
	});

	it ('Should generate a legacy receiving address at index 5', () => {
		const address = wallet.getAddress({ addressType: 'p2pkh', changeAddress: false, index: '5' });
		expect(address).to.equal('mpSZrEySmbvrMkCaSMwhRszSb4rg221CAG');
	});

});

describe('Electrum Methods', () => {
	it ('connectToElectrum: Should connect to a random Electrum server', async () => {
		const connectResponse = await wallet.connectToElectrum();
		expect(connectResponse.error).to.equal(false);
	});

	it ('getAddressBalance: Should return the balance (in sats) of the provided address', async () => {
		const address = await wallet.getAddressBalance('tb1qyvc8r7338383xjshqsz38mfn2eql879nhrf8y0');
		expect(address.error).to.equal(false);
		expect(address.confirmed).to.equal(20000);
	});
});
