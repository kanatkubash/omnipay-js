import Item from './Item';
interface IObject {
	[key: string]: any;
}
type ItemOrObj = Item | Partial<Item>
export default class ItemBag implements Iterable<Item>{
	[Symbol.iterator](): Iterator<Item> {
		var pointer = 0;
		var items = this._items;
		return {
			next(): IteratorResult<Item> {
				var exceeded = (pointer >= items.length);
				return {
					done: exceeded,
					value: exceeded ? null : items[pointer++]
				};
			}
		}
	}
	protected _items: Item[] = [];
	constructor(items: ItemOrObj[] = []) {
		this.replace(items);
	}
	replace(items: ItemOrObj[] = []) {
		this._items = [];
		for (let item of items) {
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