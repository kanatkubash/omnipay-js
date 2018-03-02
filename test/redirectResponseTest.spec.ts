import * as sinon from 'sinon';
import * as chai from 'chai';
import RedirectResponse from '../src/message/RedirectResponse';

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
require('mocha');
const expect = chai.expect;

describe('RedirectResponse', () => {

	it('should contruct correctly', () => {
		const redirResponse = new RedirectResponse('url', 'GET', {});
		expect(redirResponse).to.be.instanceOf(RedirectResponse);
		expect(redirResponse.redirectUrl).to.be.equal('url');
		expect(redirResponse.redirectMethod).to.be.equal('GET');
	});

	it('should construct without optional arg', () => {
		const redirResponse = new RedirectResponse('url', 'GET');
		expect(redirResponse).to.be.instanceOf(RedirectResponse);
		expect(redirResponse.redirectUrl).to.be.equal('url');
		expect(redirResponse.redirectMethod).to.be.equal('GET');
		expect(redirResponse.redirectData).to.be.empty;
	});

	it('should set redirectData correctly', () => {
		const data = {
			data: 1234,
		};
		const redirResponse = new RedirectResponse('url', 'GET', data);
		expect(redirResponse).to.be.instanceOf(RedirectResponse);
		expect(redirResponse.redirectData).to.be.eql(data);
	});

	it('should throw when redirectr is called', () => {
		const redirResponse = new RedirectResponse('url', 'GET', {});
		// @ts-ignore
		return expect(redirResponse.redirect()).to.eventually.be.rejected;
	});
});
