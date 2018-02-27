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
var expect = chai.expect;
require('mocha');

class MoqClient implements IClient {
	send(method: 'GET' | 'POST', uri: string, headers: Object, body: Object): IHttpResponse {
		throw new Error('Method not implemented.');
	}
	get(uri: string, headers: Object, queryObj: Object): IHttpResponse {
		throw new Error('Method not implemented.');
	}
	post(uri: string, headers: Object, postBody: Object): IHttpResponse {
		throw new Error('Method not implemented.');
	}
}

describe('GatewayFactory', () => {
	var client = sinon.createStubInstance(MoqClient);
	it('should construct correctly', () => {
		var gateway = new GatewayFactory(client);
		expect(gateway).to.be.instanceof(GatewayFactory);
	})
	it('should get gateways correctly', () => {
		var gateway = new GatewayFactory(client);
		console.log(gateway.gateways);
		expect(gateway.gateways).to.be.empty;
	})
	it('should add gateway correctly', async (done) => {
		var gateway = new GatewayFactory(client);

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
	})
	it('should throw when gateway is not found', () => {
		var gateway = new GatewayFactory(client);
		expect(() => gateway.create('JOK_GATEWAY')).to.throw(Error);
	})
});
