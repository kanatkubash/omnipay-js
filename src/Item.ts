import IItem from './IItem';
import { initialize as initializeHelper } from './helpers';
import * as _ from 'lodash';
import { IObject } from './interfaces';

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
		return _.clone(this._parameters);
	}
	/** @inheritdoc */
	get name() {
		return this._parameters['name'];
	}
	/** @inheritdoc */
	set name(value: string) {
		this._parameters['name'] = value;
	}
	/** @inheritdoc */
	get description() {
		return this._parameters['description'];
	}
	/** @inheritdoc */
	set description(value: string) {
		this._parameters['description'] = value;
	}
	/** @inheritdoc */
	get quantity() {
		return this._parameters['quantity'];
	}
	/** @inheritdoc */
	set quantity(value: number) {
		this._parameters['quantity'] = value;
	}
	/** @inheritdoc */
	get price() {
		return this._parameters['price'];
	}
	/** @inheritdoc */
	set price(value: number) {
		this._parameters['price'] = value;
	}
}
