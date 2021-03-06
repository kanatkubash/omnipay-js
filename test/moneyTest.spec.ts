import { expect } from 'chai';
import * as Money from 'js-money';
require('mocha');

describe('Money', () => {

	it('should instanciate correctly', () => {
		const money = new Money(1500, Money.USD);
		expect(money).to.instanceof(Money);
	});

	it('should show correct currency', () => {
		const money = new Money(1500, Money.KZT);
		expect(money.getCurrency() === Money.KZT.code);
	});

	it('should return correct amount', () => {
		const money = new Money(1500, Money.KZT);
		expect(money.getAmount()).to.equal(1500);
	});

	it('should print string correctly', () => {
		const money = new Money(1500, Money.KZT);
		expect(money.toString()).to.equal('15.00');
	});
});
