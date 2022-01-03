import { IGetDerivationPath, IKeyDerivationPath } from "../types";
import { addressTypes } from "../shapes";

export const getKeyDerivationPathObject = ({ addressType = 'p2wpkh', purpose, coinType, account, change = '0', index }: IGetDerivationPath): IKeyDerivationPath => {
	const path = addressTypes[addressType].path;
	const parsedPath = path.split('/');
	return {
		purpose: purpose ?? parsedPath[1],
		coinType: coinType ?? parsedPath[2],
		account: account ?? parsedPath[3],
		change: change ?? parsedPath[4],
		index: index ?? parsedPath[5],
	};
};

export const getKeyDerivationPathString = ({ addressType = 'p2wpkh', purpose, coinType, account, change = '0', index }: IGetDerivationPath): string => {
	const path = addressTypes[addressType].path;
	const parsedPath = path.split('/');
	purpose = purpose ?? parsedPath[1];
	coinType = coinType ?? parsedPath[2];
	account = account ?? parsedPath[3];
	change = change ?? parsedPath[4];
	index = index ?? parsedPath[5];
	return `m/${purpose}/${coinType}/${account}/${change}/${index}`;
};
