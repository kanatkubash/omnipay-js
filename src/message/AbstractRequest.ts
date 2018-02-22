import * as Money from 'js-money';
import * as Currencies from 'js-money/lib/currency';
import IRequest from './IRequest';
import IResponse from './IResponse';
import IClient from '../http/IClient';
import RequestError from '../exception/RequestError';
import CreditCard from '../CreditCard';
import { initialize as initializeHelper } from '../helpers';
import ItemBag from './../ItemBag';
import Item from './../Item';
import * as _ from 'lodash';
import { Container, injectable, inject } from "inversify";

interface IObject {
	[key: string]: any;
}
@injectable()
export default abstract class AbstractRequest implements IRequest {
	[key: string]: any;
	abstract get data(): any;
	protected _parameters: IObject;
	protected _client: IClient;
	protected _response: IResponse;
	protected _zeroAmountAllowed = true;
	protected _negativeAmountAllowed = false;
	get parameters(): IObject {
		return _.clone(this._parameters);
	}
	get fields(): string[] {
		return [
			'code',
		];
	}
	get response() {
		if (!this._response)
			throw new Error('You must call send() before accessing response');
		return this._response;
	}
	protected get throwIfCantSet(): any {
		if (Boolean(this._response))
			throw new Error('Cant change request after its sent');
		return void 0;
	}
	get testMode() {
		return this._parameters['testMode'];
	}
	set testMode(value: boolean) {
		this.throwIfCantSet;
		this._parameters['testMode'] = value;
	}
	get card() {
		return this._parameters['card'];
	}
	set card(value: CreditCard | IObject) {
		this.throwIfCantSet;
		var cardValue: CreditCard;
		if (value instanceof CreditCard)
			cardValue = value;
		else
			cardValue = new CreditCard(value);
		this._parameters['card'] = cardValue;
	}
	get token() {
		return this._parameters['token'];
	}
	set token(value: string) {
		this.throwIfCantSet;
		this._parameters['token'] = value;
	}
	get cardReference() {
		return this._parameters['cardReference'];
	}
	set cardReference(value: string) {
		this.throwIfCantSet;
		this._parameters['cardReference'] = value;
	}
	get currencies(): string[] {
		return Object.keys(Currencies);
	}
	get money(): Money {
		var amount = this._parameters['amount'];
		// Not even called in tests, maybe remove
		// if (amount instanceof Money);
		// return amount;
		if (amount) {
			var currency = this.currency || 'KZT';
			var number = Number(amount);
			if (Number.isNaN(number))
				throw new Error('Amount should be correct number');
			var fractionCount = (number.toString(10).split('.')[1] || '').length;
			if (fractionCount > Currencies[currency].decimal_digits)
				throw new RequestError(`Precision is too high for given currency`, {
					currency,
					amount
				});
			var money = Money.fromDecimal(number, currency);
			if (money.isNegative() && !this._negativeAmountAllowed)
				throw new RequestError('Negative amount not allowed', { money: money.getAmount() })
			if (money.isZero() && !this._zeroAmountAllowed)
				throw new RequestError('Zero amount not allowed', { money: money.getAmount() })
			return money;
		}
	}
	get amount() {
		var money = this.money;
		if (money)
			return money.toString();
	}
	set amount(value: string) {
		this.throwIfCantSet;
		this._parameters['amount'] = value;;
	}
	get amountInteger(): number {
		var money = this.money;
		if (money)
			return money.getAmount();
	}
	get description() {
		return this._parameters['description'];
	}
	set description(value: string) {
		this.throwIfCantSet;
		this._parameters['description'] = value;
	}
	get currency() {
		return this._parameters['currency'];
	}
	set currency(value: string) {
		this.throwIfCantSet;
		var newValue = (value || '').toUpperCase();
		if (this.currencies.indexOf(newValue) != -1)
			this._parameters['currency'] = newValue;
	}
	get transactionId() {
		return this._parameters['transactionId'];
	}
	set transactionId(value: number) {
		this.throwIfCantSet;
		this._parameters['transactionId'] = value;
	}
	get transactionReference() {
		return this._parameters['transactionReference'];
	}
	set transactionReference(value: string) {
		this.throwIfCantSet;
		this._parameters['transactionReference'] = value;
	}
	get items(): ItemBag | IObject[] {
		return this._parameters['items'];
	}
	set items(value) {
		this.throwIfCantSet;
		var bag = value;
		if (!(value instanceof ItemBag))
			bag = new ItemBag(value);
		this._parameters['items'] = bag;
	}
	get clientIp() {
		return this._parameters['clientIp'];
	}
	set clientIp(value) {
		this._parameters['clientIp'] = value;
	}
	get returnUrl() {
		return this._parameters['returnUrl'];
	}
	set returnUrl(value) {
		this._parameters['returnUrl'] = value;
	}
	get cancelUrl() {
		return this._parameters['cancelUrl'];
	}
	set cancelUrl(value) {
		this._parameters['cancelUrl'] = value;
	}
	get notifyUrl() {
		return this._parameters['notifyUrl'];
	}
	set notifyUrl(value) {
		this._parameters['notifyUrl'] = value;
	}
	/// Omitting HtppRequest field because JS doesn't 
	/// have common http interface
	constructor(client: IClient) {
		this._client = client;
		this._parameters = {};
	}
	/// Mostly non necessary fields:
	/// issuer?
	/// paymentMethod?
	initialize(parameters: IObject = {}): this {
		var fields = this.fields;
		initializeHelper(this, parameters);
		return this;
	}
	validate(...keys: string[]): true {
		var unsetKeys: string[] = [];
		if (Array.isArray(keys))
			for (var i = 0; i < keys.length; i++)
				if (typeof this._parameters[keys[i]] == 'undefined')
					unsetKeys.push(keys[i]);
		if (unsetKeys.length != 0)
			throw new RequestError(`Parameters not set`, { keys: unsetKeys });
		return true;
	}
	abstract async send(): Promise<IResponse>;
}
