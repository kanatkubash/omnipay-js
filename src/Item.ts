import IItem from './IItem';
import { initialize as initializeHelper } from './helpers'
interface IObject {
	[key: string]: any;
}
export default class Item implements IItem {
	protected _parameters: IObject = {};
	constructor(parameters: IObject = {}) {
		this.initialize(parameters);
	}
	initialize(parameters: IObject = {}): this {
		initializeHelper(this, parameters);
		return this;
	}
	get parameters(): IObject {
		return this._parameters;
	}
	get name() {
		return this.parameters['name'];
	}
	set name(value: string) {
		this.parameters['name'] = value;
	}
	get description() {
		return this.parameters['description'];
	}
	set description(value: string) {
		this.parameters['description'] = value;
	}
	get quantity() {
		return this.parameters['quantity'];
	}
	set quantity(value: number) {
		this.parameters['quantity'] = value;
	}
	get price() {
		return this.parameters['price'];
	}
	set price(value: number) {
		this.parameters['price'] = value;
	}
}