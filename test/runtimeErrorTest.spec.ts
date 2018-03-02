import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import RuntimeError from '../src/exception/RuntimeError';

chai.use(require('sinon-chai'));
require('mocha');
const expect = chai.expect;

describe('RuntimeError', () => {

	it('should contruct correctly', () => {
		const error = new RuntimeError('msg', {});
		expect(error).to.be.instanceOf(RuntimeError);
		expect(error.data).to.be.empty;
	});

	it('should contruct correctly without optional arg', () => {
		const error = new RuntimeError('msg');
		expect(error).to.be.instanceOf(RuntimeError);
		expect(error.data).to.be.empty;
	});

	it('should have same data as argument passed to constr', () => {
		const data = {
			data: 'data',
		};
		const error = new RuntimeError('msg', data);
		expect(error.data).to.be.eql(data);
	});
});
