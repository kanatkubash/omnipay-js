import IItem from './IItem';
import { initialize as initializeHelper } from './helpers'
interface IObject {
	[key: string]: any;
}
/**
 * Item class for representing items in basket
 */
export default class Item implements IItem {
	protected _parameters: IObject = {};
	/**
	 * Create new Item
	 * @param parameters parameters to initialize from
	 */
	constructor(parameters: IObject = {}) {
		this.initialize(parameters);
	}
	/**
	 * Initalize Item with given parameters
	 * @param parameters parameters
	 */
	initialize(parameters: IObject = {}): this {
		initializeHelper(this, parameters);
		return this;
	}
	/**
	 * Get all parameters of Item
	 */
	get parameters(): IObject {
		return this._parameters;
	}
	/** @inheritdoc */
	get name() {
		return this.parameters['name'];
	}
	/** @inheritdoc */
	set name(value: string) {
		this.parameters['name'] = value;
	}
	/** @inheritdoc */
	get description() {
		return this.parameters['description'];
	}
	/** @inheritdoc */
	set description(value: string) {
		this.parameters['description'] = value;
	}
	/** @inheritdoc */
	get quantity() {
		return this.parameters['quantity'];
	}
	/** @inheritdoc */
	set quantity(value: number) {
		this.parameters['quantity'] = value;
	}
	/** @inheritdoc */
	get price() {
		return this.parameters['price'];
	}
	/** @inheritdoc */
	set price(value: number) {
		this.parameters['price'] = value;
	}
}