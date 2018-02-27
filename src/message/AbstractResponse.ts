import * as _ from "lodash";
import IHttpResponse from "../http/IHttpResponse";
import RuntimeError from '../exception/RuntimeError';
import IResponse from "./IResponse";
import IRequest from "./IRequest";
import RedirectResponse from './RedirectResponse';
import IRedirectResponse from "./IRedirectResponse";

interface IObject {
	[key: string]: any;
}

export default abstract class AbstractResponse implements IResponse {
	protected readonly _request: IRequest;
	protected _data: IObject = {};
	abstract isSuccesful: boolean;
	abstract transactionRefernce: string;
	get request() {
		return this._request;
	}
	get data() {
		return _.clone(this._data);
	}
	abstract get isPending(): boolean;
	abstract get isRedirect(): boolean;
	abstract get isTransparentRedirect(): boolean;
	abstract get isCancelled(): boolean;
	abstract get message(): string;
	abstract get code(): string;
	abstract get transactionReference(): string;
	abstract get transactionId(): string;
	abstract get redirectUrl(): string;
	abstract get redirectMethod(): string;
	abstract get redirectData(): IObject;
	constructor(request: IRequest, data: IObject = {}) {
		this._request = request;
		this._data = data;
	}
	redirect() {
		this.redirectResponse.redirect();
	}
	/**
	 * @throws RuntimeError
	 */
	get redirectResponse(): IRedirectResponse {
		this.validateRedirect();
		if (this.redirectMethod == 'GET')
			return new RedirectResponse(this.redirectUrl, 'GET');
		else throw new RuntimeError('Not yet implemented');
		///TODO: investigate whether we need POST version of the stuff above
	}
	public validateRedirect() {
		if (!this.isRedirect)
			throw new RuntimeError('This response does not support redirection.');
		/// because redirectUrl might be null to prevent it we coalesce to empty value
		if (_.isEmpty((this.redirectUrl || '').trim()))
			throw new RuntimeError('The given redirectUrl cannot be empty.');
		if (!_.includes(['GET', 'POST'], this.redirectMethod))
			throw new RuntimeError('Invalid redirect method', { method: this.redirectMethod });
	}


}