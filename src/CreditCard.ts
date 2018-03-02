import { initialize as initializeHelper, validateLuhn } from './helpers';
import CreditCardError from './exception/CreditCardError';
import * as moment from 'moment';
import * as _ from 'lodash';
import { IObject, ReadIObject } from './interfaces';

export default class CreditCard {
	//#region Brands
	static readonly BRAND_VISA = 'visa';
	static readonly BRAND_MASTERCARD = 'mastercard';
	static readonly BRAND_DISCOVER = 'discover';
	static readonly BRAND_AMEX = 'amex';
	static readonly BRAND_DINERS_CLUB = 'diners_club';
	static readonly BRAND_JCB = 'jcb';
	static readonly BRAND_SWITCH = 'switch';
	static readonly BRAND_SOLO = 'solo';
	static readonly BRAND_DANKORT = 'dankort';
	static readonly BRAND_MAESTRO = 'maestro';
	static readonly BRAND_FORBRUGSFORENINGEN = 'forbrugsforeningen';
	static readonly BRAND_LASER = 'laser';
	//#endregion
	private static readonly REGEX_MASTERCARD
		= /^(5[1-5]\d{4}|677189)\d{10}$|^2(?:2(?:2[1-9]|[3-9]\d)|[3-6]\d\d|7(?:[01]\d|20))\d{12}$/;
	protected static readonly ALL_CARDS: ReadIObject = {
		[CreditCard.BRAND_VISA]: /^4\d{12}(\d{3})?$/,
		[CreditCard.BRAND_MASTERCARD]: CreditCard.REGEX_MASTERCARD,
		[CreditCard.BRAND_DISCOVER]: /^(6011|65\d{2}|64[4-9]\d)\d{12}|(62\d{14})$/,
		[CreditCard.BRAND_AMEX]: /^3[47]\d{13}$/,
		[CreditCard.BRAND_DINERS_CLUB]: /^3(0[0-5]|[68]\d)\d{11}$/,
		[CreditCard.BRAND_JCB]: /^35(28|29|[3-8]\d)\d{12}$/,
		[CreditCard.BRAND_SWITCH]: /^6759\d{12}(\d{2,3})?$/,
		[CreditCard.BRAND_SOLO]: /^6767\d{12}(\d{2,3})?$/,
		[CreditCard.BRAND_DANKORT]: /^5019\d{12}$/,
		[CreditCard.BRAND_MAESTRO]: /^(5[06-8]|6\d)\d{10,17}$/,
		[CreditCard.BRAND_FORBRUGSFORENINGEN]: /^600722\d{10}$/,
		[CreditCard.BRAND_LASER]: /^(6304|6706|6709|6771(?!89))\d{8}(\d{4}|\d{6,7})?$/,
	};
	protected _parameters: IObject = {};
	constructor(parameters: IObject = {}) {
		this.initialize(parameters);
	}
	get parameters(): IObject {
		return _.clone(this._parameters);
	}
	initialize(parameters: IObject = {}): this {
		initializeHelper(this, parameters);
		return this;
	}
	static get allCards(): IObject {
		return _.reduce(
			CreditCard.ALL_CARDS,
			(acc, v, k) => Object.assign(acc, { [k]: v }),
			{});
	}
	/**
	 * Return supported cards in form of {key:regex...}
	 * Particular Gateway may not be supporting all of them
	 */
	static get supportedCards(): IObject {
		return CreditCard.allCards;
	}
	getExpiryDate(format: string): string {
		return moment({ year: this.expiryYear, month: this.expiryMonth - 1 }).format(format);
	}
	get number() {
		return this._parameters['number'];
	}
	set number(value: string) {
		const num = value ? value.replace(/\D/g, '') : null;
		this._parameters['number'] = num;
	}
	get numberLastFour() {
		const num = this.number;
		return num ? num.substr(-4, 4) : null;
	}
	//#region unnecessary fields
	/// not needed for KZ
	// title?: string;
	// billing?
	// startMonth?
	// startYear?
	// issueNumber?
	// billingTitle?
	// billingName?
	// billingLastName?
	// billingFirstName?
	// billingCompany?
	// billingAddress1?
	// billingAddress2?
	// billingCity?
	// billingPostcode?
	// billingState?
	// billingCountry?
	// billingPhone?
	// billingPhoneExtension?
	// billingFax?
	// shippingTitle?
	// shippingName?
	// shippingFirstName?
	// shippingLastName?
	// shippingCompany?
	// shippingAddress1?
	// shippingAddress2?
	// shippingCity?
	// shippingPostcode?
	// shippingState?
	// shippingCountry?
	// shippingPhone?
	// shippingPhoneExtension?
	// shippingFax?
	// REMARK: is needed?
	// address1?
	// address2?
	// city?
	// postcode?
	// state?
	// country?
	// phone?
	// phoneExtension?
	// fax?
	// company?
	// email?
	// birthday?
	// gender?
	//#endregion
	get firstName() {
		return this._parameters['firstName'];
	}
	set firstName(value: string) {
		this._parameters['firstName'] = value;
	}
	get lastName() {
		return this._parameters['lastName'];
	}
	set lastName(value: string) {
		this._parameters['lastName'] = value;
	}
	get name() {
		return this.firstName + ' ' + this.lastName;
	}
	set name(value: string) {
		var [firstName, lastName] = value.split(' ', 2);
		firstName = firstName.trim();
		lastName = lastName ? lastName.trim() : null;
		this.firstName = firstName;
		this.lastName = lastName;
	}
	getNumberMasked(mask = 'X') {
		const num = this.number;
		if (num) {
			const maskLen = Math.max(this.number.length - 4, 0);
			return _.repeat(mask, maskLen) + this.numberLastFour;
		}
	}
	get brand() {
		if (this.number) {
			// tslint:disable-next-line:prefer-const
			for (var brand in CreditCard.ALL_CARDS) {
				if (this.number.match(CreditCard.ALL_CARDS[brand]))
					return brand;
			}
		}
	}
	get expiryMonth() {
		return this._parameters['expiryMonth'];
	}
	set expiryMonth(value: number) {
		this._parameters['expiryMonth'] = value;
	}
	get expiryYear() {
		return this._parameters['expiryYear'];
	}
	set expiryYear(value: number) {
		if (value > 0 && (
			(value < 100) ||
			(value < 2600 && value >= 2000)
		))
			this._parameters['expiryYear'] = value < 100 ? 2000 + value : value;
	}
	get cvv() {
		return this._parameters['cvv'];
	}
	set cvv(value: string) {
		this._parameters['cvv'] = value;
	}
	get tracks() {
		return this._parameters['tracks'];
	}
	set tracks(value: string) {
		this._parameters['tracks'] = value;
	}
	get track1() {
		return this._getTrackByPattern(/\%B\d{1,19}\^.{2,26}\^\d{4}\d*\?/);
	}
	get track2() {
		return this._getTrackByPattern(/;\d{1,19}=\d{4}\d*\?/);
	}
	protected _getTrackByPattern(pattern: RegExp) {
		var tracks;
		var matches;
		if (tracks = this.tracks)
			if (matches = tracks.match(pattern))
				return matches[0];
	}
	validate() {
		var fields: string[] = [];
		fields = ['number', 'expiryMonth', 'expiryYear'].reduce(
			(acc, param: string) =>
				this._parameters[param] ? acc : acc.concat(param),
			fields);
		if (fields.length !== 0)
			throw new CreditCardError('Parameters not set', { keys: fields });
		if (this.getExpiryDate('YYYYMM') < moment().format('YYYYMM'))
			throw new CreditCardError('Card is expired', { expired: true });
		if (!validateLuhn(this.number))
			throw new CreditCardError('Card number invalid', { invalidNumber: true });
		if (!this.number || !this.number.match(/^\d{12,19}$/))
			throw new CreditCardError('Card number should be between 12-19', { invalidNumber: true });
	}
}
