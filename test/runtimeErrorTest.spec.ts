import { expect } from 'chai';
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import RuntimeError from '../src/exception/RuntimeError';
chai.use(require('sinon-chai'));
require('mocha');

describe('RuntimeError', () => {
	it('should contruct correctly', () => {
		var error = new RuntimeError('msg', {});
		expect(error).to.be.instanceOf(RuntimeError);
		expect(error.data).to.be.empty;
	})
	it('should contruct correctly without optional arg', () => {
		var error = new RuntimeError('msg');
		expect(error).to.be.instanceOf(RuntimeError);
		expect(error.data).to.be.empty;
	})
	it('should have same data as argument passed to constr', () => {
		var data = {
			data: 'data'
		};
		var error = new RuntimeError('msg', data);
		expect(error.data).to.be.eql(data);
	})
})