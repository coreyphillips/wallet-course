export type Result<T> = Ok<T> | Err<T>;

export class Ok<T> {
	public constructor(public readonly value: T) {}

	public isOk(): this is Ok<T> {
		return true;
	}

	public isErr(): this is Err<T> {
		return false;
	}
}

// tslint:disable-next-line:max-classes-per-file
export class Err<T> {
	public constructor(public readonly error: Error) {
		// tslint:disable-next-line:no-console
		console.info(error);
	}

	public isOk(): this is Ok<T> {
		return false;
	}

	public isErr(): this is Err<T> {
		return true;
	}
}

/**
 * Construct a new Ok result value.
 */
export const ok = <T>(value: T): Ok<T> => new Ok(value);

/**
 * Construct a new Err result value.
 */
export const err = <T>(error: Error | string | unknown): Err<T | Error> => {
	if (typeof error === 'string') {
		return new Err(new Error(error));
	}
	return new Err(new Error(JSON.stringify(error)));
};
