import * as _ from "lodash";
import IGateway from "./GatewayInterface";
import IClient from './http/IClient';
import { initialize as initializeHelper } from './helpers';
import AbstractRequest from "message/AbstractRequest";

interface IObject {
	[key: string]: any;
}
interface ReadIObject {
	readonly [key: string]: any;
}

export default abstract class AbstractGateway implements IGateway {
	protected _parameters: IObject;
	protected readonly _httpClient: IClient;
	abstract name: string;
	// shortName: string;
	readonly abstract defaultParameters: ReadIObject;
	get httpClient() {
		return this._httpClient;
	}
	get parameters() {
		return Object.assign({}, this._parameters);
	}
	get testMode() {
		return this._parameters['testMode'];
	}
	set testMode(value: boolean) {
		this._parameters['testMode'] = value;
	}
	get currency() {
		return this._parameters['currency'];
	}
	set currency(value: string) {
		this._parameters['currency'] = value;
	}
	constructor(client: IClient) {
		this._httpClient = client;
		this.initialize();
	}
	get supportsAuthorize() {
		return this._isFunctionExists('authorize');
	}
	get supportsCompleteAuthorize() {
		return this._isFunctionExists('completeAuthorize');
	}
	get supportsPurchase() {
		return this._isFunctionExists('purchase');
	}
	get supportsCompletePurchase() {
		return this._isFunctionExists('completePurchase');
	}
	get supportsRefund() {
		return this._isFunctionExists('refund');
	}
	get supportsVoid() {
		return this._isFunctionExists('void');
	}
	get supportsCapture() {
		return this._isFunctionExists('capture');
	}
	get supportsAcceptNotification() {
		return this._isFunctionExists('acceptNotification');
	}
	get supportsCreateCard() {
		return this._isFunctionExists('createCard');
	}
	get supportsDeleteCard() {
		return this._isFunctionExists('deleteCard');
	}
	get supportsUpdateCard() {
		return this._isFunctionExists('updateCard');
	}
	initialize(parameters: IObject = {}) {
		this._parameters = {};
		_.each(this.defaultParameters, (val: any, key: string) => {
			this._parameters[key] = val;
		});
		initializeHelper(this, parameters);
	}
	protected _createRequest<T extends AbstractRequest>
		(TRequest: new (client: IClient) => T,
		parameters: IObject = {}): T {
		var request = new TRequest(this._httpClient);
		request.initialize(parameters);
		return request;
	}
	private _isFunctionExists(funcName: string): boolean {
		return typeof Object.getPrototypeOf(this)[funcName] == 'function';
	}
}