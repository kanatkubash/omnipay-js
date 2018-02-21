import IHttpResponse from "http/IHttpResponse";

enum HTTP_VERB {
	GET = 'GET',
	POST = 'POST',
}

export default interface IClient {
	send(method: HTTP_VERB, uri: string, headers: Object, body: Object): IHttpResponse;
	get(uri: string, headers: Object, queryObj: Object): IHttpResponse;
	post(uri: string, headers: Object, postBody: Object): IHttpResponse;
}
