import NotificationStatus from './NotificationStatus';

export default interface INotification {
	transactionReference: string;
	transactionStatus: NotificationStatus;
	message: string;
}
