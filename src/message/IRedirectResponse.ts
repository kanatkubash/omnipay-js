export default interface IRedirectResponse {
	redirectUrl?: string;
	redirectMethod?: 'GET' | 'POST';
	redirectData?: Object;
	/// CONSIDER: maybe redirect does not wait for async stuff
	redirect(): Promise<void>;
}
