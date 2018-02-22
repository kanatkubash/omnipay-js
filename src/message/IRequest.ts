/// CONSIDER: parameter as propxy object
import IMessage from './IMessage';
import IResponse from './IResponse';

export default interface IRequest extends IMessage {
	parameters?: Object;
	response: IResponse;
	initialize(parameters: Object): void;
	send(data: Object): Promise<IResponse>;
}
