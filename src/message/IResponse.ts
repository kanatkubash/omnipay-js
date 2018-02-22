import IMessage from './IMessage';
import IRequest from './IRequest';

export default interface IResponse {
	request: IRequest;
	isSuccesful?: boolean;
	isRedirect?: boolean;
	isCancelled?: boolean;
	message?: string;
	code?: string;
	transactionRefernce?: string;
}
