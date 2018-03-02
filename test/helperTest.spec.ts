import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import { validateLuhn, initialize } from '../src/helpers';
import * as sinon from 'sinon';
import CreditCard from '../src/CreditCard';

chai.use(require('sinon-chai'));
require('mocha');
const expect = chai.expect;

describe('Helper', () => {

	describe('Luhn validator', () => {

		it('should validate luhn', () => {
			var res = validateLuhn('4111111111111111');
			expect(res).to.equal(true);
			res = validateLuhn('4111111111111110');
			expect(res).to.equal(false);
			res = validateLuhn('378282246310005');
			expect(res).to.equal(true);
			res = validateLuhn('5555555555554444');
			expect(res).to.equal(true);
			res = validateLuhn('378282246310005');
			expect(res).to.equal(true);
			res = validateLuhn('378282246310006');
			expect(res).to.equal(false);
		});

		it('should return true to null', () => {
			const res = validateLuhn(null);
			expect(res).to.equal(true);
		});
	});

	describe('Initalizer', () => {

		it('should ignore null', () => {
			initialize({}, null);
		});

		it('construct with empty params', () => {
			initialize({});
		});

		it('should call setters', () => {
			const nameSpy = sinon.spy();
			const numberSpy = sinon.spy();
			const card = sinon.createStubInstance(CreditCard);
			sinon.stub(card, 'number').set(numberSpy);
			sinon.stub(card, 'name').set(nameSpy);
			initialize(card, { number: '1234', name: 'Zhake' });
			expect(numberSpy).to.have.been.calledWith('1234').calledOnce;
			expect(nameSpy).to.have.been.calledWith('Zhake').calledOnce;
		});

		it('should ignore invalid parameters', () => {
			const params: any = [];
			class TestClass {
				set name(value: string) { }
			}
			const testClass = new TestClass;
			// @ts-ignore
			const nameSpy = sinon.spy(testClass, 'name', ['set']);
			initialize(testClass, { name: 'name', extra: 'ba' });
			expect(nameSpy.set).to.have.been.calledWith('name').calledOnce;
		});
	});
});
