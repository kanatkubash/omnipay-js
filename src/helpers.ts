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
export function validateLuhn(number: string): boolean {
	if (!number) return true;
	var str = Array.from(number)
		.reverse()
		.map(a => Number(a))
		.reduce((acc, val, i) => acc + (i % 2 ? (val * 2) : val), '');
	return Array.from(str)
		.reduce((acc, val) => acc + Number(val), 0) % 10 === 0;
}
/// Instead of getting gateway name from class , 
/// we would be using decorators on impl classes
export var getGatewayShortName = () => { }