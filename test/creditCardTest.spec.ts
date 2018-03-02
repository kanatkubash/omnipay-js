import CreditCard from '../src/CreditCard';
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import CreditCardError from '../src/exception/CreditCardError';

chai.use(require('sinon-chai'));
require('mocha');
const expect = chai.expect;

describe('CreditCard', () => {

	it('shouldnt change allCards variable', () => {
		const allCards = CreditCard.allCards;
		allCards['novy_karta'] = /1234/;
		expect(CreditCard.allCards).not.have.property('novy_karta');
	});

	it('shouldnt change parameters from outside', () => {
		const card = new CreditCard();
		const params = card.parameters;
		params['param'] = 'pararam';
		expect(card.parameters).not.have.property('param');
	});

	it('should construct properly with params', () => {
		const card = new CreditCard({
			number: '1234',
			extra: 123,
			name: 'ATY ZHONY',
		});
		expect(card.name).to.be.equal('ATY ZHONY');
		expect(card.number).to.be.equal('1234');
		expect(card.parameters).to.not.have.property('extra');
	});

	it('should initalize correctly with initalize()', () => {
		const card = new CreditCard;
		card.initialize({ name: 'A B' });
		expect(card.name).to.be.equal('A B');
	});

	it('should get parameters correctly', () => {
		const card = new CreditCard({
			number: '1234',
			extra: 123,
			name: 'ATY ZHONY',
			expiryMonth: 10,
			expiryYear: 2000,
		});
		const cardParams = card.parameters;
		expect(cardParams['number']).to.be.equal('1234');
		/// CreditCard doesnt have this setter
		expect(cardParams['extra']).to.be.undefined;
		expect(cardParams['firstName']).to.be.equal('ATY');
		expect(cardParams['lastName']).to.be.equal('ZHONY');
		expect(cardParams['expiryMonth']).to.be.equal(10);
		expect(cardParams['expiryYear']).to.be.equal(2000);
	});

	it('should not set non existing setters', () => {
		const card = new CreditCard({
			iDontExist: true,
		});
		expect(card.parameters['iDontExist']).to.be.undefined;
	});

	it('should validate true', () => {
		const card = new CreditCard;
		card.number = '4111111111111111';
		card.firstName = 'Example';
		card.lastName = 'Customer';
		card.expiryMonth = 4;
		card.expiryYear = new Date().getFullYear() + 2;
		card.cvv = '123';
		card.validate();
	});

	it('should throw wrong number', () => {
		const card = new CreditCard;
		card.number = '4111111111111110';
		card.firstName = 'Example';
		card.lastName = 'Customer';
		card.expiryMonth = 4;
		card.expiryYear = new Date().getFullYear() + 2;
		card.cvv = '123';
		expect(() => card.validate()).to.throw(CreditCardError, 'Card number invalid');
	});

	it('should require number', () => {
		const card = new CreditCard;
		expect(() => card.validate())
			.to.throw(CreditCardError, 'Parameters not set');
		expect(() => card.validate())
			.to.throw(CreditCardError, 'Parameters not set')
			.that.has.property('data')
			.that.has.property('keys').that.include('number');
	});

	it('should require expiryMonth and expiryYear', () => {
		const card = new CreditCard({
			number: '4003 0327 1234 5678',
		});
		expect(() => card.validate())
			.to.throw(CreditCardError, 'Parameters not set')
			.that.has.property('data')
			.that.has.property('keys').that.include('expiryMonth', 'expiryYear')
			.and.does.not.include('number');
	});
	/// 76.19

	it('should validate expiration', () => {
		const card = new CreditCard({
			number: '1',
			expiryMonth: 1,
			expiryYear: new Date().getFullYear() - 1,
		});
		expect(() => { card.validate(); }).to.throw(CreditCardError, 'Card is expired');
	});

	it('should throw invalid number error', () => {
		const card = new CreditCard({
			number: '1',
			expiryMonth: 1,
			expiryYear: new Date().getFullYear() + 1,
		});
		expect(() => { card.validate(); }).to.throw(CreditCardError, 'Card number invalid');
	});

	it('should check card number is between 12-19', () => {
		const card = new CreditCard({
			number: '1234567897',
			expiryMonth: 1,
			expiryYear: new Date().getFullYear() + 1,
		});
		expect(() => { card.validate(); })
			.to.throw(CreditCardError, 'Card number should be between 12-19');
		card.number = '12345678971234567897675';
		expect(() => { card.validate(); })
			.to.throw(CreditCardError, 'Card number should be between 12-19');
	});

	it('should return all cards', () => {
		const cards = CreditCard.allCards;
		// expect(cards)
		// 	.to.have.key(CreditCard.BRAND_AMEX)
		// 	.and.to.have.key(CreditCard.BRAND_VISA)
		// 	.and.to.have.key(CreditCard.BRAND_MASTERCARD);
		expect(cards)
			.to.contain.keys([
				CreditCard.BRAND_AMEX,
				CreditCard.BRAND_VISA,
				CreditCard.BRAND_MASTERCARD,
			]);
	});

	it('should return supported cards', () => {
		expect(CreditCard.supportedCards).to.be.eql(CreditCard.allCards);
	});

	it('should return lastName', () => {
		const card = new CreditCard;
		card.lastName = 'Familia';
		expect(card.lastName).to.be.equal('Familia');
	});

	it('should return firstName', () => {
		const card = new CreditCard;
		card.firstName = 'Imya';
		expect(card.firstName).to.be.equal('Imya');
	});

	it('should set name correctly', () => {
		const card = new CreditCard;
		card.name = 'aty zhony';
		expect(card.firstName).to.be.equal('aty');
		expect(card.lastName).to.be.equal('zhony');
		expect(card.name).to.be.equal('aty zhony');
	});

	it('should handle only firstname', () => {
		const card = new CreditCard;
		card.name = 'onlyFirstName';
		expect(card.firstName).to.be.equal('onlyFirstName');
		expect(card.lastName).to.be.null;
	});

	it('should handle multi name', () => {
		const card = new CreditCard;
		card.name = 'firstName middleName lastName';
		expect(card.firstName).to.be.equal('firstName');
		/// JS just skips other array parts when splitting
		/// PHP concats remainder to last array element
		expect(card.lastName).to.be.equal('middleName');
	});

	it('should strip non numeric stuff', () => {
		const card = new CreditCard;
		card.number = '4716 9414 1662 0070 some text';
		expect(card.number).to.be.equal('4716941416620070');
	});

	it('should show last 4 digits', () => {
		var card = new CreditCard;
		card.number = '4716941416620070';
		expect(card.numberLastFour).to.be.equal('0070');
		card = new CreditCard;
		card.number = '4716-9414+1662_0_0_7_0';
		expect(card.numberLastFour).to.be.equal('0070');
	});

	it('should show correct mask with 4 numbers', () => {
		var card = new CreditCard;
		card.number = '4716941416620070';
		expect(card.getNumberMasked('#')).to.be.equal('############0070');
		card = new CreditCard;
		card.number = '4716-9414+1662_0_0_7_0';
		expect(card.getNumberMasked()).to.be.equal('XXXXXXXXXXXX0070');
	});

	it('should return undefined for default brand', () => {
		const card = new CreditCard;
		expect(card.brand).to.be.undefined;
	});

	it('should return VISA as brand', () => {
		const card = new CreditCard;
		card.number = '4716941416620070';
		expect(card.brand).to.be.equal(CreditCard.BRAND_VISA);
	});

	it('should return MasterCard as brand', () => {
		const card = new CreditCard;
		card.number = '5308482774777492';
		expect(card.brand).to.be.equal(CreditCard.BRAND_MASTERCARD);
	});

	it('should return AmEx as brand', () => {
		const card = new CreditCard;
		card.number = '346713492924965';
		expect(card.brand).to.be.equal(CreditCard.BRAND_AMEX);
	});

	it('should be correct expiryYear', () => {
		var card = new CreditCard;
		card.expiryYear = 2030;
		expect(card.expiryYear).to.be.equal(2030);
		card = new CreditCard;
		card.expiryYear = 123;
		expect(card.expiryYear).to.be.undefined;
	});

	it('should be correct expiryMonth', () => {
		const card = new CreditCard;
		card.expiryMonth = 5;
		expect(card.expiryMonth).to.be.equal(5);
	});

	it('should be correct expiryYear for 2 digit year', () => {
		const card = new CreditCard;
		card.expiryYear = 15;
		expect(card.expiryYear).to.be.equal(2015);
	});

	it('should be correct cvv', () => {
		const card = new CreditCard;
		card.cvv = '123';
		expect(card.cvv).to.be.equal('123');
	});

	it('should be correct tracks', () => {
		const card = new CreditCard;
		const track = '%B4242424242424242^SMITH/JOHN ^1520126100000000000000444000000';
		card.tracks = track;
		expect(card.tracks).to.be.equal(track);
	});
	/// We dont need track stuff. I wont we writing other track tests

	it('should return correct expiryDate', () => {
		const card = new CreditCard;
		card.initialize({
			expiryYear: 2015,
			expiryMonth: 11,
		});
		expect(card.getExpiryDate('MM/YY')).to.be.equal('11/15');
		card.initialize({
			expiryYear: 20,
			expiryMonth: 1,
		});
		expect(card.getExpiryDate('MM.YY')).to.be.equal('01.20');
		expect(card.getExpiryDate('MM.YYYY')).to.be.equal('01.2020');
	});
});
