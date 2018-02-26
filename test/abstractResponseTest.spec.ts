import { expect } from 'chai';
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import IRequest from '../src/message/IRequest';
import IResponse from '../src/message/IResponse';
import AbstractResponse from '../src/message/AbstractResponse';
import RuntimeError from '../src/exception/RuntimeError';
import RedirectResponse from '../src/message/RedirectResponse';
chai.use(require('sinon-chai'));
require('mocha');

interface IObject {
	[key: string]: any;
}

class MoqRequest implements IRequest {
	parameters?: Object;
	response: IResponse;
	initialize(parameters: Object): void {
		throw new Error("Method not implemented.");
	}
	send(data: Object): Promise<IResponse> {
		throw new Error("Method not implemented.");
	}
	data: any;

}

class MoqResponse extends AbstractResponse {
	isPending: boolean;
	isRedirect: boolean;
	isTransparentRedirect: boolean;
	isCancelled: boolean;
	message: string;
	code: string;
	transactionReference: string;
	transactionId: string;
	redirectUrl: string;
	redirectMethod: string;
	redirectData: IObject;
}

describe('AbstractResponse', () => {
	var request = sinon.createStubInstance(MoqRequest);
	it('should consruct correctly', () => {
		var response = new MoqResponse(request, {});
		expect(response.request).to.be.equal(request);
		expect(response.data).to.be.eql({});
	})
	it('should construct without optional argument', () => {
		var response = new MoqResponse(request);
		expect(response.data).to.be.eql({});
	})
	it('should pass data argument correctly ', () => {
		var data = {
			'data': 'yes'
		};
		var response = new MoqResponse(request, data);
		expect(response.request).to.be.equal(request);
		expect(response.data).to.be.eql(data);
	})
	it('shouldnot change original data property when changed externally', () => {
		var data = {
			mocking: 'bird'
		};
		var response = new MoqResponse(request, data);
		response.data.mocking = 'jay';
		expect(response.data).to.be.eql(data);
	})
	it('should return corect request prop', () => {
		var response = new MoqResponse(request);
		expect(response.request).to.be.equal(request);
		expect(response.request).to.be.instanceOf(MoqRequest);
	})
	it('should throw when redirect data is not correct', () => {
		var response = new MoqResponse(request);
		response.isRedirect = false;
		expect(() => response.validateRedirect())
			.to.throw(RuntimeError, 'This response does not support redirection.');

		response.isRedirect = true;
		expect(() => response.validateRedirect())
			.to.throw(RuntimeError, 'The given redirectUrl cannot be empty.');

		response.redirectUrl = "http://redirectUrl";
		expect(() => response.validateRedirect())
			.to.throw(RuntimeError, 'Invalid redirect method');
	})
	it('should pass validateRedirect()', () => {
		var response = new MoqResponse(request);
		response.isRedirect = true;
		response.redirectUrl = 'redirect url';
		response.redirectMethod = 'GET';
		expect(response.validateRedirect()).to.not.throw;
	})
	it('should return redirectResponse', () => {
		var response = new MoqResponse(request);
		response.isRedirect = true;
		response.redirectUrl = 'url';
		response.redirectMethod = 'GET';
		expect(response.redirectResponse).to.be.instanceOf(RedirectResponse);
		expect(response.redirectResponse.redirectUrl).to.be.equal('url');
	})
	it('should throw not impl when POST redirect', () => {
		var response = new MoqResponse(request);
		response.isRedirect = true;
		response.redirectUrl = 'url';
		response.redirectMethod = 'POST';
		expect(() => response.redirectResponse)
			.to.throw(RuntimeError, 'Not yet implemented');

	})
	it('should call redirect once on redirectResponse', () => {
		var response = new MoqResponse(request);
		var redirectResponse = sinon.createStubInstance(RedirectResponse);
		sinon.stub(response, 'redirectResponse').get(() => redirectResponse);
		response.redirect();
		expect(redirectResponse.redirect).to.have.been.calledOnce;
	})
})