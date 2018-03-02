import { IObject } from '../interfaces';

export default interface IHttpResponse {
	headers: IObject;
	body: any;
	status: number;
}
