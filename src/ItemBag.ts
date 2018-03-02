import Item from './Item';

type ItemOrObj = Item | Partial<Item>;
export default class ItemBag implements Iterable<Item>{
	// tslint:disable-next-line:function-name
	[Symbol.iterator](): Iterator<Item> {
		var pointer = 0;
		const items = this._items;
		return {
			next(): IteratorResult<Item> {
				const exceeded = (pointer >= items.length);
				return {
					done: exceeded,
					// tslint:disable-next-line:no-increment-decrement
					value: exceeded ? null : items[pointer++],
				};
			},
		};
	}
	protected _items: Item[] = [];
	constructor(items: ItemOrObj[] = []) {
		this.replace(items);
	}
	replace(items: ItemOrObj[] = []) {
		this._items = [];
		// tslint:disable-next-line:prefer-const
		for (var item of items) {
			this.add(item);
		}
	}
	add(item: ItemOrObj) {
		if (item instanceof Item)
			this._items.push(item);
		else
			this._items.push(new Item(item));
	}
	get count(): number {
		return this._items.length;
	}
	get items(): Item[] {
		return this._items.map(a => a);
	}
}
