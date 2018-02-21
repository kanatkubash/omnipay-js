interface IObject {
	[key: string]: any;
}
interface CardErrorData extends IObject {
	expired?: boolean,
	keys?: string[],
	invalidNumber?: boolean
}
export default class CreditCardError extends Error {
	protected _data: CardErrorData = {
	};
	get data(): CardErrorData {
		return Object.assign({}, this._data);
	}
	constructor(message: string, data: Partial<CardErrorData>) {
		super(message);
		Object.keys(data).forEach(
			key => this._data[key] = data[key]);
	}
}