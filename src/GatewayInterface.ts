interface IObject {
	[key: string]: any;
}

export default interface IGateway {
	name: string;
	// shortName: string;
	defaultParameters: IObject;
	initialize(parameters: IObject): void;
	parameters: IObject;
}