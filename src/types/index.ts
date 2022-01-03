export type TAvailableNetworks = 'bitcoin' | 'testnet';
export type TElectrumNetworks = 'bitcoin' | 'bitcoinTestnet';
export type TAddressType = 'p2wpkh' | 'p2sh' | 'p2pkh';
export type TAddressLabel = 'bech32' | 'segwit' | 'legacy';
export type TKeyDerivationPurpose = '84' | '49' | '44' | string; //"p2wpkh" | "p2sh" | "p2pkh";
export type TKeyDerivationCoinType = '0' | '1' | string; //"mainnet" | "testnet";
export type TKeyDerivationAccount = '0' | string;
export type TKeyDerivationChange = '0' | '1'; //"Receiving Address" | "Change Address";
export type TKeyDerivationIndex = string;

export interface IWallet {
    mnemonic: string;
    passphrase?: string;
    network?: TAvailableNetworks;
}

export interface IAddressData {
    path: string;
    type: 'p2wpkh' | 'p2sh' | 'p2pkh';
    label: string;
}

export interface IAddressType {
    [key: string]: IAddressData;
}

// m / purpose' / coin_type' / account' / change / address_index
export interface IKeyDerivationPath {
    purpose?: TKeyDerivationPurpose;
    coinType?: TKeyDerivationCoinType;
    account?: TKeyDerivationAccount;
    change?: TKeyDerivationChange;
    index?: TKeyDerivationIndex;
}

export interface IGetDerivationPath extends IKeyDerivationPath {
    addressType?: TAddressType;
}

export interface IGetAddress {
    index?: TKeyDerivationIndex;
    changeAddress?: boolean;
    addressType?: TAddressType;
}

export interface IConnectToElectrumRes {
    error: boolean;
}

export interface IGetAddressBalanceRes {
    error: boolean;
    confirmed: number;
    unconfirmed: number;
}
