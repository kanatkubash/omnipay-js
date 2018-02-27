import IClient from './http/IClient';
import { GatewayFactory } from './GatewayFactory';

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
	static create(name: string) {
		Omnipay._factory.create(name);
	}
}
