interface IObject {
	[key: string]: any;
}
export function initialize(object: any, parameters: IObject = {}) {
	var proto = Object.getPrototypeOf(object);
	for (var key in parameters) {
		/// Check whether class has setter for given key
		if (typeof proto.__lookupSetter__(key) != 'undefined')
			object[key] = parameters[key];
	}
}