import 'reflect-metadata';
import { Container, injectable, inject } from "inversify";
import { expect } from 'chai';
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
chai.use(require('sinon-chai'));
require('mocha');

interface IObject {
	[key: string]: any;
}
@injectable()
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
	constructor( @inject('IClient') client: IClient) { super(client); }
}
@injectable()
class MoqClient implements IClient {
	send(method: 'GET' | 'POST', uri: string, headers: Object, body: Object): IHttpResponse {
		throw new Error("Method not implemented.");
	}
	get(uri: string, headers: Object, queryObj: Object): IHttpResponse {
		throw new Error("Method not implemented.");
	}
	post(uri: string, headers: Object, postBody: Object): IHttpResponse {
		throw new Error("Method not implemented.");
	}
}

var container = new Container();
container.bind<IClient>('IClient').to(MoqClient);
// container.bind<Item>(Item);
// container.bind<ItemBag>(ItemBag);
container.bind<MoqRequest>('MoqRequest').to(MoqRequest);

describe('AbstractRequest', () => {
	it('should contructor', () => {
		var req = container.resolve(MoqRequest);
		expect(req.parameters).to.be.empty;
	})
	var a: any;
	it('should init with params', () => {
		var req = container.resolve(MoqRequest);
		req.initialize({ amount: '2.25' });
		a = req;
		expect(req.amount).to.be.equal('2.25');
	})
	it('shouldnt init after request sent', async () => {
		var req = container.resolve(MoqRequest);
		await req.send();
		expect(() => { req.initialize({ amount: '123' }) })
			.to.throw(Error, 'Cant change request after its sent');
	})
	it('should return card correctly', () => {
		var req = container.resolve(MoqRequest);
		var card = sinon.createStubInstance(CreditCard);
		req.card = card;
		expect(req.card).to.be.equal(card);
	})
	it('should set card from plain card object argument', () => {
		var req = container.resolve(MoqRequest);
		req.card = { number: '1234 5678 9101' };
		expect(req.card).to.be.instanceOf(CreditCard);
		expect((req.card as CreditCard).number).to.be.equal('123456789101');
	})
	it('should be same init and explicit setting argument', () => {
		var req = container.resolve(MoqRequest);
		req.initialize({ token: '12345' });
		var token = req.token;
		req.token = '67890';
		token += req.token;
		expect(token).to.be.equal('1234567890');
	})
	it('should set token correctly', () => {
		var req = container.resolve(MoqRequest);
		var token = '654987654';
		req.token = token;
		expect(req.token).to.be.equal(token);
	})
	it('should set cardReference correctly', () => {
		var req = container.resolve(MoqRequest);
		var cardReference = '654987654';
		req.cardReference = cardReference;
		expect(req.cardReference).to.be.equal(cardReference);
	})
	describe('amount', () => {
		it('should set amount correctly', () => {
			var req = container.resolve(MoqRequest);
			var amount = '125.55';
			req.amount = amount;
			expect(req.amount).to.be.equal(amount);
		})
		it('shouldnot allow amount with long fraction', () => {
			var req = container.resolve(MoqRequest);
			req.initialize({ amount: '12.25001' });
			expect(() => { req.amount; })
				.to.throw(RequestError, 'Precision is too high for given currency');
		})
		it('should throw when amount is non-numeric', () => {
			var req = container.resolve(MoqRequest);
			var amount = 'NotANumber';
			req.amount = amount;
			expect(() => req.amount).to.throw('Amount should be correct number');
		})
		it('should set amount null', () => {
			var req = container.resolve(MoqRequest);
			req.amount = null;
			expect(req.amount).to.be.undefined;
		})
		it('should set zero amount', () => {
			var req = container.resolve(MoqRequest);
			req.amount = '0.00';
			expect(req.amount).to.be.equal('0.00');
		})
		it('should throw zero not allowed', () => {
			var req = container.resolve(MoqRequest);
			req.amount = '0.00';
			req.setZeroAllow(false);
			expect(() => req.amount).to.be.throw('Zero amount not allowed');
		})
		it('should allow negative amount', () => {
			var req = container.resolve(MoqRequest);
			req.amount = '-1000.11';
			req.setNegativeAllow(true);
			expect(req.amount).to.be.ok;
		})
		it('should throw negative amount not allowed by default', () => {
			var req = container.resolve(MoqRequest);
			req.amount = '-1';
			expect(() => req.amount).to.be.throw('Negative amount not allowed');
		})
		it('should allow zero by default', () => {
			var req = container.resolve(MoqRequest);
			req.amount = '0.00';
			expect(req.amount).to.be.ok;
		})
		it('should cast long zero to 0', () => {
			var req = container.resolve(MoqRequest);
			req.amount = '000000.000000000000000000000000000000000000000000000000';
			expect(req.amount).to.be.equal('0.00');
		})
		it('should set 103500000', () => {
			var req = container.resolve(MoqRequest);
			req.amount = '103500000';
			expect(req.amount).to.be.equal('103500000.00');
		})
		it('should throw for fractional JPY (JPY\'s dont have)', () => {
			var req = container.resolve(MoqRequest);
			req.amount = '12.5';
			req.currency = 'JPY';
			expect(() => req.amount).to.throw(RequestError, 'Precision is too high for given currency');
		})
		it('should return integer', () => {
			var req = container.resolve(MoqRequest);
			req.amount = '15.15';
			expect(req.amountInteger).to.be.equal(1515);
		})
		it('should return amount*100', () => {
			var req = container.resolve(MoqRequest);
			req.amount = '10';
			expect(req.amountInteger).to.be.equal(1000);
		})
		it('should return same integer for BYR', () => {
			///BYR JPY dont have fractionals;
			var req = container.resolve(MoqRequest);
			req.amount = '5';
			req.currency = 'BYR';
			expect(req.amountInteger).to.be.equal(5);
		})
		it('should throw to comma amounts', () => {
			var req = container.resolve(MoqRequest);
			req.amount = '10,1000.00';
			expect(() => req.amount).to.throw(Error);
		})
		it('should throw to multi period amount 1.2.3', () => {
			var req = container.resolve(MoqRequest);
			req.amount = '12.34.56';
			expect(() => req.amount).to.throw(Error);
		})
	})
	describe('currency', () => {
		it('should set currency correctly', () => {
			var req = container.resolve(MoqRequest);
			var currency = 'USD';
			req.currency = currency;
			expect(req.currency).to.be.equal(currency);
		})
		it('should uppercase parameter', () => {
			var req = container.resolve(MoqRequest);
			var currency = 'kzt';
			req.currency = currency;
			expect(req.currency).to.be.equal(currency.toUpperCase());
		})
		it('should skip null', () => {
			var req = container.resolve(MoqRequest);
			req.currency = null;
			expect(req.currency).to.be.undefined;
		})
		it('should skip nonexisting currency', () => {
			var req = container.resolve(MoqRequest);
			var currency = 'JOKVALUTA';
			req.currency = currency;
			expect(req.currency).to.be.undefined;
		})
	})
	it('should set description correctly', () => {
		var req = container.resolve(MoqRequest);
		var description = 'desc';
		req.description = description;
		expect(req.description).to.be.equal(description);
	})
	it('should set transactionId correctly', () => {
		var req = container.resolve(MoqRequest);
		var transactionId = 521;
		req.transactionId = transactionId;
		expect(req.transactionId).to.be.equal(transactionId);
	})
	it('should set transactionReference correctly', () => {
		var req = container.resolve(MoqRequest);
		var transactionReference = 'trRef';
		req.transactionReference = transactionReference;
		expect(req.transactionReference).to.be.equal(transactionReference);
	})
	it('should set items from array argument', () => {
		var req = container.resolve(MoqRequest);
		req.items = [{ name: 'FuseTea' }, { name: 'Haier' }];
		expect(req.items).to.be.instanceOf(ItemBag);
		// @ts-ignore
		var itemBag: ItemBag = req.items as ItemBag;
		expect(itemBag.items).to.have.lengthOf(2);
		expect(itemBag.items[0].name).to.be.equal('FuseTea');
		expect(itemBag.items[1].name).to.be.equal('Haier');
	})
	it('should set items from array argument', () => {
		var req = container.resolve(MoqRequest);
		var itemBag = new ItemBag([{ name: 'FuseTea' }, { name: 'Haier' }]);
		req.items = itemBag;
		expect(req.items).to.be.instanceOf(ItemBag);
		expect(itemBag.items).to.be.eql(req.items.items);
	})
	it('should set clientIp correctly', () => {
		var req = container.resolve(MoqRequest);
		var clientIp = '12.34.5.8';
		req.clientIp = clientIp;
		expect(req.clientIp).to.be.equal(clientIp);
	})
	it('should set returnUrl correctly', () => {
		var req = container.resolve(MoqRequest);
		var returnUrl = 'http://s.i';
		req.returnUrl = returnUrl;
		expect(req.returnUrl).to.be.equal(returnUrl);
	})
	it('should set cancelUrl correctly', () => {
		var req = container.resolve(MoqRequest);
		var cancelUrl = 'http://a.b';
		req.cancelUrl = cancelUrl;
		expect(req.cancelUrl).to.be.equal(cancelUrl);
	})
	it('should set and get testMode correctly', () => {
		var req = container.resolve(MoqRequest);
		var testMode = true;
		req.testMode = testMode;
		expect(req.testMode).to.be.equal(testMode);
	})
	it('should set notifyUrl correctly', () => {
		var req = container.resolve(MoqRequest);
		var notifyUrl = 'http://a.b';
		req.notifyUrl = notifyUrl;
		expect(req.notifyUrl).to.be.equal(notifyUrl);
	})
	it('should set issuer correctly', () => {
		var req = container.resolve(MoqRequest);
		var issuer = 'BANK';
		req.issuer = issuer;
		expect(req.issuer).to.be.equal(issuer);
	})
	it('should return parameters correctly', () => {
		var req = container.resolve(MoqRequest);
		var testMode = true;
		var token = 'token';
		var clientIp = '12.34.56.78';
		req.testMode = testMode;
		req.token = token;
		req.clientIp = clientIp;
		expect(req.parameters).to.be.eql({ testMode, token, clientIp });
	})
	it('shouldnot change inner params from outside', () => {
		var req = container.resolve(MoqRequest);
		req.initialize({ token: '123' });
		var params = req.parameters;
		params.extra = 'extra';
		expect(req.parameters).to.not.have.property('extra');
	})
	it('should throw when changing param after send()', async () => {
		var req = container.resolve(MoqRequest);
		await req.send();
		expect(() => req.amount = '1')
			.to.throw(Error, 'Cant change request after its sent');
	})
	it('should validate correctly given fields', () => {
		var req = container.resolve(MoqRequest);
		req.initialize({ token: 'asdf', testMode: false });
		expect(req.validate()).to.be.ok;
		expect(req.validate('token', 'testMode')).to.be.ok;
	})
	it('should throw non existent params when validating', () => {
		var req = container.resolve(MoqRequest);
		req.amount = '123';
		/// Belissimo CHAI 👌
		expect(() => req.validate('amount', 'token'))
			.to.throw(RequestError, 'Parameters not set')
			.that.has.property('data')
			.that.has.property('keys')
			.that.eql(['token']);
	})
	it('should return undef currency if not set', () => {
		var req = container.resolve(MoqRequest);
		expect(req.currency).to.be.undefined;
	})
	it('should throw when getting response before sending', () => {
		var req = container.resolve(MoqRequest);
		expect(() => req.response)
			.to.throw(Error, 'You must call send() before accessing response');
	})
	it('should get money class after getting amount', () => {
		var req = container.resolve(MoqRequest);
		req.amount = '15.15';
		expect(req.amount).to.be.equal('15.15');
		expect(req.amount).to.be.equal('15.15');
		expect(req.money).to.be.instanceOf(Money);
	})
	it(`should return correct response.\r\n`
		+ `In fact test is useless as impl. of send() is inside test`, async () => {
			var req = container.resolve(MoqRequest);
			await req.send();
			expect(req.response).to.be.instanceOf(AbstractResponse);
		})
})