import 'reflect-metadata';
import { Container, injectable, inject } from 'inversify';
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import AbstractRequest from '../src/message/AbstractRequest';
import AbstractResponse from '../src/message/AbstractResponse';
import IClient from '../src/http/IClient';
import IHttpResponse from 'http/IHttpResponse';
import ItemBag from '../src/ItemBag';
import Item from '../src/Item';
import * as Money from 'js-money';
import IResponse from '../src/message/IResponse';
import RequestError from '../src/exception/RequestError';
import CreditCard from '../src/CreditCard';
import { IObject } from '../src/interfaces';

chai.use(require('sinon-chai'));
const expect = chai.expect;
require('mocha');

class MoqRequest extends AbstractRequest {
	async send(): Promise<IResponse> {
		this._response = sinon.createStubInstance(AbstractResponse);
		return this._response;
	}
	get data(): any {
		return [];
	}
	setZeroAllow(value: boolean) {
		this._zeroAmountAllowed = value;
	}
	setNegativeAllow(value: boolean) {
		this._negativeAmountAllowed = value;
	}
	constructor(client: IClient) { super(client); }
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
const resolveMoqRequest = () => new MoqRequest(new MoqClient());

describe('AbstractRequest', () => {

	it('should contructor', () => {
		const req = resolveMoqRequest();
		expect(req.parameters).to.be.empty;
	});
	var a: any;

	it('should init with params', () => {
		const req = resolveMoqRequest();
		req.initialize({ amount: '2.25' });
		a = req;
		expect(req.amount).to.be.equal('2.25');
	});

	it('shouldnt init after request sent', async () => {
		const req = resolveMoqRequest();
		await req.send();
		expect(() => req.initialize({ amount: '123' }))
			.to.throw(Error, 'Cant change request after its sent');
	});

	it('should return card correctly', () => {
		const req = resolveMoqRequest();
		const card = sinon.createStubInstance(CreditCard);
		req.card = card;
		expect(req.card).to.be.equal(card);
	});

	it('should set card from plain card object argument', () => {
		const req = resolveMoqRequest();
		req.card = { number: '1234 5678 9101' };
		expect(req.card).to.be.instanceOf(CreditCard);
		expect((req.card as CreditCard).number).to.be.equal('123456789101');
	});

	it('should be same init and explicit setting argument', () => {
		const req = resolveMoqRequest();
		req.initialize({ token: '12345' });
		var token = req.token;
		req.token = '67890';
		token += req.token;
		expect(token).to.be.equal('1234567890');
	});

	it('should set token correctly', () => {
		const req = resolveMoqRequest();
		const token = '654987654';
		req.token = token;
		expect(req.token).to.be.equal(token);
	});

	it('should set cardReference correctly', () => {
		const req = resolveMoqRequest();
		const cardReference = '654987654';
		req.cardReference = cardReference;
		expect(req.cardReference).to.be.equal(cardReference);
	});

	describe('amount', () => {

		it('should set amount correctly', () => {
			const req = resolveMoqRequest();
			const amount = '125.55';
			req.amount = amount;
			expect(req.amount).to.be.equal(amount);
		});

		it('shouldnot allow amount with long fraction', () => {
			const req = resolveMoqRequest();
			req.initialize({ amount: '12.25001' });
			expect(() => req.amount)
				.to.throw(RequestError, 'Precision is too high for given currency');
		});

		it('should throw when amount is non-numeric', () => {
			const req = resolveMoqRequest();
			const amount = 'NotANumber';
			req.amount = amount;
			expect(() => req.amount).to.throw('Amount should be correct number');
		});

		it('should set amount null', () => {
			const req = resolveMoqRequest();
			req.amount = null;
			expect(req.amount).to.be.undefined;
		});

		it('should set zero amount', () => {
			const req = resolveMoqRequest();
			req.amount = '0.00';
			expect(req.amount).to.be.equal('0.00');
		});

		it('should throw zero not allowed', () => {
			const req = resolveMoqRequest();
			req.amount = '0.00';
			req.setZeroAllow(false);
			expect(() => req.amount).to.be.throw('Zero amount not allowed');
		});

		it('should allow negative amount', () => {
			const req = resolveMoqRequest();
			req.amount = '-1000.11';
			req.setNegativeAllow(true);
			expect(req.amount).to.be.ok;
		});

		it('should throw negative amount not allowed by default', () => {
			const req = resolveMoqRequest();
			req.amount = '-1';
			expect(() => req.amount).to.be.throw('Negative amount not allowed');
		});

		it('should allow zero by default', () => {
			const req = resolveMoqRequest();
			req.amount = '0.00';
			expect(req.amount).to.be.ok;
		});

		it('should cast long zero to 0', () => {
			const req = resolveMoqRequest();
			req.amount = '000000.000000000000000000000000000000000000000000000000';
			expect(req.amount).to.be.equal('0.00');
		});

		it('should set 103500000', () => {
			const req = resolveMoqRequest();
			req.amount = '103500000';
			expect(req.amount).to.be.equal('103500000.00');
		});

		it('should throw for fractional JPY (JPY\'s dont have)', () => {
			const req = resolveMoqRequest();
			req.amount = '12.5';
			req.currency = 'JPY';
			expect(() => req.amount).to.throw(RequestError, 'Precision is too high for given currency');
		});

		it('should return integer', () => {
			const req = resolveMoqRequest();
			req.amount = '15.15';
			expect(req.amountInteger).to.be.equal(1515);
		});

		it('should return amount*100', () => {
			const req = resolveMoqRequest();
			req.amount = '10';
			expect(req.amountInteger).to.be.equal(1000);
		});

		it('should return same integer for BYR', () => {
			/// BYR JPY dont have fractionals;
			const req = resolveMoqRequest();
			req.amount = '5';
			req.currency = 'BYR';
			expect(req.amountInteger).to.be.equal(5);
		});

		it('should throw to comma amounts', () => {
			const req = resolveMoqRequest();
			req.amount = '10,1000.00';
			expect(() => req.amount).to.throw(Error);
		});

		it('should throw to multi period amount 1.2.3', () => {
			const req = resolveMoqRequest();
			req.amount = '12.34.56';
			expect(() => req.amount).to.throw(Error);
		});
	});

	describe('currency', () => {

		it('should set currency correctly', () => {
			const req = resolveMoqRequest();
			const currency = 'USD';
			req.currency = currency;
			expect(req.currency).to.be.equal(currency);
		});

		it('should uppercase parameter', () => {
			const req = resolveMoqRequest();
			const currency = 'kzt';
			req.currency = currency;
			expect(req.currency).to.be.equal(currency.toUpperCase());
		});

		it('should skip null', () => {
			const req = resolveMoqRequest();
			req.currency = null;
			expect(req.currency).to.be.undefined;
		});

		it('should skip nonexisting currency', () => {
			const req = resolveMoqRequest();
			const currency = 'JOKVALUTA';
			req.currency = currency;
			expect(req.currency).to.be.undefined;
		});
	});

	it('should set description correctly', () => {
		const req = resolveMoqRequest();
		const description = 'desc';
		req.description = description;
		expect(req.description).to.be.equal(description);
	});

	it('should set transactionId correctly', () => {
		const req = resolveMoqRequest();
		const transactionId = 521;
		req.transactionId = transactionId;
		expect(req.transactionId).to.be.equal(transactionId);
	});

	it('should set transactionReference correctly', () => {
		const req = resolveMoqRequest();
		const transactionReference = 'trRef';
		req.transactionReference = transactionReference;
		expect(req.transactionReference).to.be.equal(transactionReference);
	});

	it('should set items from array argument', () => {
		const req = resolveMoqRequest();
		req.items = [{ name: 'FuseTea' }, { name: 'Haier' }];
		expect(req.items).to.be.instanceOf(ItemBag);
		// @ts-ignore
		const itemBag: ItemBag = req.items as ItemBag;
		expect(itemBag.items).to.have.lengthOf(2);
		expect(itemBag.items[0].name).to.be.equal('FuseTea');
		expect(itemBag.items[1].name).to.be.equal('Haier');
	});

	it('should set items from array argument', () => {
		const req = resolveMoqRequest();
		const itemBag = new ItemBag([{ name: 'FuseTea' }, { name: 'Haier' }]);
		req.items = itemBag;
		expect(req.items).to.be.instanceOf(ItemBag);
		expect(itemBag.items).to.be.eql(req.items.items);
	});

	it('should set clientIp correctly', () => {
		const req = resolveMoqRequest();
		const clientIp = '12.34.5.8';
		req.clientIp = clientIp;
		expect(req.clientIp).to.be.equal(clientIp);
	});

	it('should set returnUrl correctly', () => {
		const req = resolveMoqRequest();
		const returnUrl = 'http://s.i';
		req.returnUrl = returnUrl;
		expect(req.returnUrl).to.be.equal(returnUrl);
	});

	it('should set cancelUrl correctly', () => {
		const req = resolveMoqRequest();
		const cancelUrl = 'http://a.b';
		req.cancelUrl = cancelUrl;
		expect(req.cancelUrl).to.be.equal(cancelUrl);
	});

	it('should set and get testMode correctly', () => {
		const req = resolveMoqRequest();
		const testMode = true;
		req.testMode = testMode;
		expect(req.testMode).to.be.equal(testMode);
	});

	it('should set notifyUrl correctly', () => {
		const req = resolveMoqRequest();
		const notifyUrl = 'http://a.b';
		req.notifyUrl = notifyUrl;
		expect(req.notifyUrl).to.be.equal(notifyUrl);
	});

	it('should set issuer correctly', () => {
		const req = resolveMoqRequest();
		const issuer = 'BANK';
		req.issuer = issuer;
		expect(req.issuer).to.be.equal(issuer);
	});

	it('should return parameters correctly', () => {
		const req = resolveMoqRequest();
		const testMode = true;
		const token = 'token';
		const clientIp = '12.34.56.78';
		req.testMode = testMode;
		req.token = token;
		req.clientIp = clientIp;
		expect(req.parameters).to.be.eql({ testMode, token, clientIp });
	});

	it('shouldnot change inner params from outside', () => {
		const req = resolveMoqRequest();
		req.initialize({ token: '123' });
		const params = req.parameters;
		params.extra = 'extra';
		expect(req.parameters).to.not.have.property('extra');
	});

	it('should throw when changing param after send()', async () => {
		const req = resolveMoqRequest();
		await req.send();
		expect(() => req.amount = '1')
			.to.throw(Error, 'Cant change request after its sent');
	});

	it('should validate correctly given fields', () => {
		const req = resolveMoqRequest();
		req.initialize({ token: 'asdf', testMode: false });
		expect(req.validate()).to.be.ok;
		expect(req.validate('token', 'testMode')).to.be.ok;
	});

	it('should throw non existent params when validating', () => {
		const req = resolveMoqRequest();
		req.amount = '123';
		/// Belissimo CHAI 👌
		expect(() => req.validate('amount', 'token'))
			.to.throw(RequestError, 'Parameters not set')
			.that.has.property('data')
			.that.has.property('keys')
			.that.eql(['token']);
	});

	it('should return undef currency if not set', () => {
		const req = resolveMoqRequest();
		expect(req.currency).to.be.undefined;
	});

	it('should throw when getting response before sending', () => {
		const req = resolveMoqRequest();
		expect(() => req.response)
			.to.throw(Error, 'You must call send() before accessing response');
	});

	it('should get money class after getting amount', () => {
		const req = resolveMoqRequest();
		req.amount = '15.15';
		expect(req.amount).to.be.equal('15.15');
		expect(req.amount).to.be.equal('15.15');
		expect(req.money).to.be.instanceOf(Money);
	});
	it(`should return correct response.\r\n`, async () => {
		console.log(`In fact test is useless as impl. of send() is inside test`);
		const req = resolveMoqRequest();
		await req.send();
		expect(req.response).to.be.instanceOf(AbstractResponse);
	});
});
