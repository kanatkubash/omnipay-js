import * as _ from 'lodash';
import { IObject } from '../interfaces';

export default class RequestError extends Error {
	protected _data: IObject = {};
	get data() {
		return _.clone(this._data);
	}
	constructor(message: string, data: IObject = {}) {
		super(message);
		Object.keys(data).forEach(
			key => this._data[key] = data[key]);
	}
}
