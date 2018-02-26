import IRedirectResponse from "./IRedirectResponse";

interface IObject {
	[key: string]: any;
}

export default class RedirectResponse implements IRedirectResponse {
	protected readonly _redirectUrl: string;
	protected readonly _redirectData: IObject = {};
	readonly redirectMethod?: "GET" | "POST";
	get redirectUrl(): string {
		return this._redirectUrl;
	}
	get redirectData(): IObject {
		return this._redirectData;
	}
	async redirect(): Promise<void> {
		throw new Error("not impl");
	}
	constructor(redirectUrl: string, redirectMethod: 'GET' | 'POST', redirectData: IObject = {}) {
		this.redirectMethod = redirectMethod;
		this._redirectUrl = redirectUrl;
		this._redirectData = redirectData;
	}
}