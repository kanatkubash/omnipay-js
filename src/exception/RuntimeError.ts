interface IObject {
	[key: string]: any;
}
export default class RuntimeError extends Error {
	protected _data: IObject = {};
	get data(): IObject {
		return Object.assign({}, this._data);
	}
	constructor(message: string, data: IObject = {}) {
		super(message);
		Object.keys(data).forEach(
			key => this._data[key] = data[key]);
	}
}