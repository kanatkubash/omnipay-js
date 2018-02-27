import IClient from './http/IClient';
import { GatewayFactory } from './GatewayFactory';
import AbstractGateway from './AbstractGateway';

export default class Omnipay {
	static _client: IClient;
	static _factory: GatewayFactory;
	static set client(value: IClient) {
		Omnipay._client = value;
	}
	static get factory() {
		if (!Omnipay._factory)
			Omnipay._factory = new GatewayFactory(Omnipay._client);
		return Omnipay._factory;
	}
	static create<T extends AbstractGateway>(name: string): T {
		return Omnipay.factory.create(name);
	}
	register() {
		/// TODO: looks like need implementation
		/// as JS decorators cant do nothing when not imported
	}
}
