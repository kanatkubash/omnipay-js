import Item from './Item';

export interface IObject {
	[key: string]: any;
}
export interface ReadIObject {
	readonly [key: string]: any;
}
export type ItemOrObj = Item | Partial<Item>;
export interface CardErrorData extends IObject {
	expired?: boolean;
	keys?: string[];
	invalidNumber?: boolean;
}
