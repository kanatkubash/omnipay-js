import { expect } from 'chai';
import * as Money from 'js-money';
import Item from '../src/Item';
require('mocha');
describe('Item', () => {
	it('should construct with params', () => {
		var item = new Item({ name: 'Jeski Disk' });
		expect(item.name).to.equal('Jeski Disk');
	})
	var item = new Item();
	it('should init correctly', () => {
		item.initialize({ name: 'Mawina' });
		expect(item.name).to.equal('Mawina');
	})
	it('should set only name', () => {
		item.name = 'Kitap';
		expect(item.parameters).to.deep.equal({ name: 'Kitap' });
	})
	it('should return correctly after setting properties', () => {
		item.name = 'Fotik';
		expect(item.name).to.equal('Fotik');
		expect(item.parameters).to.deep.equal({ name: 'Fotik' });
		item.description = 'Nikon 7200';
		expect(item.description).to.equal('Nikon 7200');
		expect(item.parameters).to.deep.equal({ name: 'Fotik', description: 'Nikon 7200' });
		item.price = 1500;
		expect(item.price).to.equal(1500);
		expect(item.parameters).to.deep.equal({
			name: 'Fotik',
			description: 'Nikon 7200',
			price: 1500
		});
		item.quantity = 2;
		expect(item.quantity).to.equal(2);
		expect(item.parameters).to.deep.equal({
			name: 'Fotik',
			description: 'Nikon 7200',
			price: 1500,
			quantity: 2
		});
	})
})