import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import CreditCardError from '../src/exception/CreditCardError';

chai.use(require('sinon-chai'));
require('mocha');
const expect = chai.expect;

describe('CreditCardException', () => {

	it('thrown correclty', () => {
		expect(() => {
			throw new CreditCardError('E durs emes karta', { keys: [] });
		}).to.throw(CreditCardError, 'E durs emes karta')
	});

	it('has correct data', () => {
		const error = new CreditCardError('error', { invalidNumber: true });
		expect(error.data).to.eql({ invalidNumber: true });
	});
});
