import { expect } from 'chai';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import { validateLuhn, initialize, getGatewayShortName } from '../src/helpers';
import * as sinon from 'sinon';
import { spy } from 'sinon';
import CreditCard from '../src/CreditCard';
chai.use(require('sinon-chai'));
require('mocha');
describe('Helper', () => {
	describe('Luhn validator', () => {
		it('should validate luhn', () => {
			var res = validateLuhn('4111111111111111');
			expect(res).to.equal(true);
			var res = validateLuhn('4111111111111110');
			expect(res).to.equal(false);
			var res = validateLuhn('378282246310005');
			expect(res).to.equal(true);
			var res = validateLuhn('5555555555554444');
			expect(res).to.equal(true);
			var res = validateLuhn('378282246310005');
			expect(res).to.equal(true);
			var res = validateLuhn('378282246310006');
			expect(res).to.equal(false);
		})
		it('should return true to null', () => {
			var res = validateLuhn(null);
			expect(res).to.equal(true);
		})
	})
	describe('Initalizer', () => {
		it('should ignore null', () => {
			initialize({}, null);
		})
		it('construct with empty params', () => {
			initialize({});
		})
		it('should call setters', () => {
			var nameSpy = sinon.spy(), numberSpy = sinon.spy();
			var card = sinon.createStubInstance(CreditCard);
			sinon.stub(card, 'number').set(numberSpy);
			sinon.stub(card, 'name').set(nameSpy);
			initialize(card, { number: '1234', name: 'Zhake' });
			expect(numberSpy).to.have.been.calledWith('1234').calledOnce;
			expect(nameSpy).to.have.been.calledWith('Zhake').calledOnce;
		})
		it('should ignore invalid parameters', () => {
			var params: any = [];
			class TestClass {
				set name(value: string) { }
			}
			var testClass = new TestClass;
			// @ts-ignore
			var nameSpy = sinon.spy(testClass, 'name', ['set']);
			initialize(testClass, { name: 'name', extra: 'ba' });
			expect(nameSpy.set).to.have.been.calledWith('name').calledOnce;
		})
		it('to fill up code coverage', () => {
			getGatewayShortName();
		})
	})
})
