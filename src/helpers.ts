import { IObject } from './interfaces';

export function initialize(object: any, parameters: IObject = {}) {
	const proto = Object.getPrototypeOf(object);
	// tslint:disable-next-line:prefer-const
	for (var key in parameters) {
		/// Check whether class has setter for given key
		if (typeof proto.__lookupSetter__(key) !== 'undefined')
			object[key] = parameters[key];
	}
}
export function validateLuhn(num: string): boolean {
	if (!num) return true;
	const str = Array.from(num)
		.reverse()
		.map(a => Number(a))
		// tslint:disable-next-line:strict-boolean-expressions
		.reduce((acc, val, i) => acc + (i % 2 ? (val * 2) : val), '');
	return Array.from(str)
		.reduce((acc, val) => acc + Number(val), 0) % 10 === 0;
}
