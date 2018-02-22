import IHttpResponse from "http/IHttpResponse";

export default interface IClient {
	send(method: 'GET' | 'POST', uri: string, headers: Object, body: Object): IHttpResponse;
	get(uri: string, headers: Object, queryObj: Object): IHttpResponse;
	post(uri: string, headers: Object, postBody: Object): IHttpResponse;
}
