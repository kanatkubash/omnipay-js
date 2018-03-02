import IHttpResponse from './IHttpResponse';

export default interface IClient {
	send(method: 'GET' | 'POST', uri: string, headers: Object, body: Object): Promise<IHttpResponse>;
	get(uri: string, headers: Object, queryObj: Object): Promise<IHttpResponse>;
	post(uri: string, headers: Object, postBody: Object): Promise<IHttpResponse>;
}
