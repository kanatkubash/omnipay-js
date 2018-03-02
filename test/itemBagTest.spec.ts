import ItemBag from '../src/ItemBag';
import Item from '../src/Item';
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

chai.use(require('sinon-chai'));
require('mocha');
const expect = chai.expect;

describe('ItemBag', () => {

	it('should construct correctly', () => {
		const itemBag = new ItemBag([
			{ name: 'item' },
			{ name: 'item2' },
		]);
		expect(itemBag.count).to.be.equal(2);
	});

	it('should construct correctly with no argument', () => {
		var itemBag = new ItemBag();
		expect(itemBag.count).to.be.equal(0);
		itemBag = new ItemBag([]);
		expect(itemBag.count).to.be.equal(0);
	});

	it('should have same items as constructor arguments', () => {
		const items = [
			sinon.createStubInstance(Item),
			sinon.createStubInstance(Item),
		];
		const itemBag = new ItemBag(items);
		expect(itemBag.items).to.be.eql(items);
	});

	it('should replace correctly', () => {
		const items = [
			sinon.createStubInstance(Item),
			sinon.createStubInstance(Item),
		];
		const itemBag = new ItemBag();
		itemBag.replace(items);
		expect(itemBag.items).to.be.eql(items);
	});

	it('should add Item instance', () => {
		const itemBag = new ItemBag();
		const item = new Item({ name: 'CD-ROM' });
		itemBag.add(item);
		expect(itemBag.items[0]).to.be.instanceOf(Item);
		expect(itemBag.items).to.contain(item);
	});

	it('should add object', () => {
		const itemBag = new ItemBag();
		const itemDesc = { name: 'CD-ROM' };
		itemBag.add(itemDesc);
		expect(itemBag.items[0]).to.be.instanceOf(Item);
		expect(itemBag.items[0].name).to.be.equal(itemDesc.name);
	});

	it('should iterate for...of', () => {
		const itemBag = new ItemBag();
		const item1 = new Item({ name: 'item1' });
		const item2 = new Item({ name: 'item2' });
		itemBag.add(item1);
		itemBag.add(item1);
		var items = [];
		for (const item of itemBag) {
			items.push(item);
		}
		expect(items).to.be.eql(itemBag.items);
		items = [];
		for (const item of itemBag) {
			items.push(item);
		}
		expect(items.length).to.be.equal(itemBag.items.length);
	});

	it('should return count correct', () => {
		const itemBag = new ItemBag();
		const item1 = new Item({ name: 'item1' });
		const item2 = new Item({ name: 'item2' });
		itemBag.add(item1);
		itemBag.add(item1);
		expect(itemBag.count).to.be.equal(2);
	});
});
