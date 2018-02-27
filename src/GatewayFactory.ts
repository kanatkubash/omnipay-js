import AbstractGateway from './AbstractGateway';
import IClient from './http/IClient';

export type GatewayConstructor = new (client: IClient) => AbstractGateway;

interface GatewayIdentifier {
	[key: string]: GatewayConstructor;
}

const gateways: GatewayIdentifier = {};

export class GatewayFactory {
	public constructor(client: IClient) {
		this._client = client;
	}
	protected readonly _client: IClient;
	protected get _gateways() {
		return gateways;
	}
	public get gateways() {
		return Object.keys(this._gateways);
	}
	public create(name: string): AbstractGateway {
		var gateway = this._gateways[name];
		if (!gateway)
			throw new Error('No such gateway');
		return new gateway(this._client);
	}
}

export var gateway = (name: string) => {
	return <T extends AbstractGateway>(constructor: GatewayConstructor): GatewayConstructor => {
		gateways[name] = constructor;
		return constructor;
	};
};

