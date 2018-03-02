import 'reflect-metadata';
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import AbstractGateway from '../src/AbstractGateway';
import IClient from '../src/http/IClient';
import IHttpResponse from '../src/http/IHttpResponse';
import AbstractRequest from '../src/message/AbstractRequest';
import IResponse from '../src/message/IResponse';

chai.use(sinonChai);
require('mocha');
const expect = chai.expect;

interface IObject {
	[key: string]: any;
}
interface ReadIObject {
	readonly [key: string]: any;
}

class Moq extends AbstractRequest {
	data: any;
	send(): Promise<IResponse> {
		throw new Error('Method not implemented.');
	}
	// 	constructor(client: IClient) {
	// super(client)
	// 	}
}

class MoqGateway extends AbstractGateway {
	readonly defaultParameters: ReadIObject = {
		test: 'yes',
	};
	readonly name: string = 'Moq';
	authorize() { }
	purchase() { }
	acceptNotification() { }
	void() { }
	testCreateRequestWithParam<T extends AbstractRequest>(a: new (aa: IClient) => T, params: IObject) {
		return this._createRequest(a, params);
	}
	testCreateRequestNoParam<T extends AbstractRequest>(a: new (aa: IClient) => T) {
		return this._createRequest(a);
	}
}

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

describe('AbstractGateway', () => {
	const client = sinon.createStubInstance(MoqClient);

	it('should construct properly', () => {
		const gateway = new MoqGateway(client);
		expect(gateway).to.be.instanceOf(AbstractGateway);
		expect(gateway.parameters).to.be.empty;
		expect(gateway.httpClient).to.be.equal(client);
	});

	it('should initialize properly', () => {
		const gateway = new MoqGateway(client);
		const params = {
			testMode: true,
			currency: 'KZT',
		};
		gateway.initialize(params);
		expect(gateway.parameters).to.be.eql({ ...params, ...gateway.defaultParameters });
	});

	it('should initialize lacking optional arg ', () => {
		const gateway = new MoqGateway(client);
		gateway.initialize();
		expect(gateway.parameters).to.be.eql(gateway.defaultParameters);
	});

	it('should return defaultParameters', () => {
		const gateway = new MoqGateway(client);
		expect(gateway.defaultParameters).to.be.eql({ test: 'yes' });
	});

	it('should return correct parameters', () => {
		const gateway = new MoqGateway(client);
		gateway.testMode = true;
		expect(gateway.parameters).to.be.eql({ testMode: true });
	});

	it('should return http client', () => {
		const gateway = new MoqGateway(client);
		expect(gateway.httpClient).to.be.instanceOf(MoqClient);
		expect(gateway.httpClient).to.be.equal(client);
	});

	it('should get/set testMode', () => {
		const gateway = new MoqGateway(client);
		gateway.testMode = true;
		expect(gateway.testMode).to.be.true;
	});

	it('should get/set currency', () => {
		const gateway = new MoqGateway(client);
		gateway.currency = 'AUD';
		expect(gateway.currency).to.be.equal('AUD');
	});

	it('should return name', () => {
		const gateway = new MoqGateway(client);
		expect(gateway.name).to.be.equal('Moq');
	});

	describe('Check Supports', () => {
		const gateway = new MoqGateway(client);

		it('should return correct supportsAuthorize', () => {
			expect(gateway.supportsAuthorize).to.be.true;
		});

		it('should return correct supportsCompleteAuthorize', () => {
			expect(gateway.supportsCompleteAuthorize).to.be.false;
		});

		it('should return correct supportsPurchase', () => {
			expect(gateway.supportsPurchase).to.be.true;
		});

		it('should return correct supportsCompletePurchase', () => {
			expect(gateway.supportsCompletePurchase).to.be.false;
		});

		it('should return correct supportsRefund', () => {
			expect(gateway.supportsRefund).to.be.false;
		});

		it('should return correct supportsVoid', () => {
			expect(gateway.supportsVoid).to.be.true;
		});

		it('should return correct supportsCapture', () => {
			expect(gateway.supportsCapture).to.be.false;
		});

		it('should return correct supportsAcceptNotification', () => {
			expect(gateway.supportsAcceptNotification).to.be.true;
		});

		it('should return correct supportsCreateCard', () => {
			expect(gateway.supportsCreateCard).to.be.false;
		});

		it('should return correct supportsDeleteCard', () => {
			expect(gateway.supportsDeleteCard).to.be.false;
		});

		it('should return correct supportsUpdateCard', () => {
			expect(gateway.supportsUpdateCard).to.be.false;
		});
	});

	it('should create correct request and initalize', () => {
		/// HACK-START mock a constructor
		const wrap = { Moq };
		const moqRequest = new Moq(new MoqClient);
		const initSpy = sinon.spy(moqRequest, 'initialize');
		const constructorSpy = sinon.stub(wrap, 'Moq')
			.returns(moqRequest);
		/// HACK-END
		const gateway = new MoqGateway(client);
		const data = {
			currency: 'USD',
		};
		const request = gateway.testCreateRequestWithParam(wrap.Moq, data);
		expect(constructorSpy.calledWithNew()).to.be.ok;
		expect(constructorSpy).have.been.calledOnce;
		expect(initSpy).have.been.calledOnce;
		expect(request.currency).to.be.equal('USD');
		expect(request).to.be.instanceof(AbstractRequest);
	});

	it('should create correct request without parameters optional arg', () => {
		/// HACK-START mock a constructor
		const wrap = { Moq };
		const moqRequest = new Moq(new MoqClient);
		const initSpy = sinon.spy(moqRequest, 'initialize');
		const constructorSpy = sinon.stub(wrap, 'Moq')
			.returns(moqRequest);
		/// HACK-END
		const gateway = new MoqGateway(client);
		const data = {
			currency: 'USD',
		};
		const request = gateway.testCreateRequestNoParam(wrap.Moq);
		expect(request.parameters).to.be.empty;
		expect(request).to.be.instanceof(AbstractRequest);
	});

});
