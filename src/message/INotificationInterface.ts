import { NotificationStatus } from './NotificationStatusEnum';

export default interface INotificationInterface {
	transactionReference?: string;
	getTransactionStatus?: NotificationStatus;
	message?: string;
}
