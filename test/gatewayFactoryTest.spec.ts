import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import AbstractRequest from '../src/message/AbstractRequest';
import AbstractResponse from '../src/message/AbstractResponse';
import IClient from '../src/http/IClient';
import IHttpResponse from 'http/IHttpResponse';
import ItemBag from '../src/ItemBag';
import Item from '../src/Item';
import * as Money from 'js-money';
import IResponse from '../src/message/IResponse';
import RequestError from '../src/exception/RequestError';
import CreditCard from '../src/CreditCard';
import { GatewayFactory, gateway as gatewayDecorator } from '../src/GatewayFactory';
import AbstractGateway from '../src/AbstractGateway';
import { IObject, ReadIObject } from '../src/interfaces';

chai.use(require('sinon-chai'));
require('mocha');
const expect = chai.expect;

class MoqClient implements IClient {
	send(method: 'GET' | 'POST', uri: string, headers: Object, body: Object): Promise<IHttpResponse> {
		throw new Error('Method not implemented.');
	}
	get(uri: string, headers: Object, queryObj: Object): Promise<IHttpResponse> {
		throw new Error('Method not implemented.');
	}
	post(uri: string, headers: Object, postBody: Object): Promise<IHttpResponse> {
		throw new Error('Method not implemented.');
	}
}

describe('GatewayFactory', () => {
	const client = sinon.createStubInstance(MoqClient);

	it('should construct correctly', () => {
		const gateway = new GatewayFactory(client);
		expect(gateway).to.be.instanceof(GatewayFactory);
	});

	it('should get gateways correctly', () => {
		const gateway = new GatewayFactory(client);
		expect(gateway.gateways).to.be.empty;
	});

	it('should add gateway correctly', async (done) => {
		const gateway = new GatewayFactory(client);

		(() => {
			@gatewayDecorator('MOQ')
			class MoqGateway extends AbstractGateway {
				name: string = 'NAME';
				defaultParameters: ReadIObject;
			}
			expect(gateway.gateways).to.contain('MOQ');
			expect(gateway.create('MOQ')).to.be.instanceof(AbstractGateway);
			expect(gateway.create('MOQ')).to.have.property('name', 'NAME');
			done();
		})();
	});

	it('should throw when gateway is not found', () => {
		const gateway = new GatewayFactory(client);
		expect(() => gateway.create('JOK_GATEWAY')).to.throw(Error);
	});
});
