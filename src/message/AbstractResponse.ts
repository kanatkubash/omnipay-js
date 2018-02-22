import IResponse from "./IResponse";
import IRequest from "./IRequest";

export default class AbstractResponse implements IResponse {
	request: IRequest;
	isSuccesful?: boolean;
	isRedirect?: boolean;
	isCancelled?: boolean;
	message?: string;
	code?: string;
	transactionRefernce?: string;
}