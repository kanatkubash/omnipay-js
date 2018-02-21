interface IObject {
	[key: string]: string;
}
export default interface IHttpResponse {
	headers: IObject;
	body: any;
	status: number;
}