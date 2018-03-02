interface Currency {
	symbol: string;
	name: string;
	symbol_native: string;
	decimal_digits: number;
	rounding: number;
	code: string;
	name_plural: string;
	numericCode: string;
}
type Currencies = 'USD' | 'CAD' | 'EUR' | 'BTC' | 'AED' | 'AFN'
	| 'ALL' | 'AMD' | 'ARS' | 'AUD' | 'AZN' | 'BAM' | 'BDT'
	| 'BGN' | 'BHD' | 'BIF' | 'BND' | 'BOB' | 'BRL' | 'BWP'
	| 'BYR' | 'BZD' | 'CDF' | 'CHF' | 'CLP' | 'CNY' | 'COP'
	| 'CRC' | 'CVE' | 'CZK' | 'DJF' | 'DKK' | 'DOP' | 'DZD'
	| 'EEK' | 'EGP' | 'ERN' | 'ETB' | 'GBP' | 'GEL' | 'GHS'
	| 'GNF' | 'GTQ' | 'HKD' | 'HNL' | 'HRK' | 'HUF' | 'IDR'
	| 'ILS' | 'INR' | 'IQD' | 'IRR' | 'ISK' | 'JMD' | 'JOD'
	| 'JPY' | 'KES' | 'KHR' | 'KMF' | 'KRW' | 'KWD' | 'KZT'
	| 'LAK' | 'LBP' | 'LKR' | 'LTL' | 'LVL' | 'LYD' | 'MAD'
	| 'MDL' | 'MGA' | 'MKD' | 'MMK' | 'MOP' | 'MUR' | 'MXN'
	| 'MYR' | 'MZN' | 'NAD' | 'NGN' | 'NIO' | 'NOK' | 'NPR'
	| 'NZD' | 'OMR' | 'PAB' | 'PEN' | 'PHP' | 'PKR' | 'PLN'
	| 'PYG' | 'QAR' | 'RON' | 'RSD' | 'RUB' | 'RWF' | 'SAR'
	| 'SDG' | 'SEK' | 'SGD' | 'SOS' | 'SYP' | 'THB' | 'TND'
	| 'TOP' | 'TRY' | 'TTD' | 'TWD' | 'TZS' | 'UAH' | 'UGX'
	| 'UYU' | 'UZS' | 'VEF' | 'VND' | 'XAF' | 'XOF' | 'YER'
	| 'ZAR' | 'ZMK' | string;
type MoneyObject = {
	amount: number;
	currency: Currencies | Currency;
}
type Rounders = ['round', 'floor', 'ceil'];
type RoundFunction = (num: number) => number;
declare class Money {
	constructor(amount: number, currency: Currencies | Currency);
	amount: number;
	currency: Currency;
	static fromInteger(amount: number, currency: Currencies | Currency): Money;
	static fromDecimal(amount: number, currency: Currencies | Currency): Money;
	static fromDecimal(amount: number, currency: Currencies | Currency, rounder: Rounders | RoundFunction): Money;
	equals(other: Money): boolean;
	add(other: Money): Money;
	subtract(other: Money): Money;
	multiply(multiplier: number): Money;
	multiply(multiplier: number, rounder: RoundFunction): Money;
	divide(divisor: number): Money;
	divide(divisor: number, rounder: RoundFunction): Money;
	allocate(ratios: number[]): Money[];
	compare(other: Money): number;
	greaterThan(other: Money): boolean;
	greaterThanOrEqual(other: Money): boolean;
	lessThan(other: Money): boolean;
	lessThanOrEqual(other: Money): boolean;
	isZero(): boolean;
	isPositive(): boolean;
	isNegative(): boolean;
	toDecimal(): number;
	toString(): string;
	toJSON(): MoneyObject;
	getAmount(): number;
	getCurrency(): string;
	//#region Currencies
	static USD: Currency;
	static CAD: Currency;
	static EUR: Currency;
	static BTC: Currency;
	static AED: Currency;
	static AFN: Currency;
	static ALL: Currency;
	static AMD: Currency;
	static ARS: Currency;
	static AUD: Currency;
	static AZN: Currency;
	static BAM: Currency;
	static BDT: Currency;
	static BGN: Currency;
	static BHD: Currency;
	static BIF: Currency;
	static BND: Currency;
	static BOB: Currency;
	static BRL: Currency;
	static BWP: Currency;
	static BYR: Currency;
	static BZD: Currency;
	static CDF: Currency;
	static CHF: Currency;
	static CLP: Currency;
	static CNY: Currency;
	static COP: Currency;
	static CRC: Currency;
	static CVE: Currency;
	static CZK: Currency;
	static DJF: Currency;
	static DKK: Currency;
	static DOP: Currency;
	static DZD: Currency;
	static EEK: Currency;
	static EGP: Currency;
	static ERN: Currency;
	static ETB: Currency;
	static GBP: Currency;
	static GEL: Currency;
	static GHS: Currency;
	static GNF: Currency;
	static GTQ: Currency;
	static HKD: Currency;
	static HNL: Currency;
	static HRK: Currency;
	static HUF: Currency;
	static IDR: Currency;
	static ILS: Currency;
	static INR: Currency;
	static IQD: Currency;
	static IRR: Currency;
	static ISK: Currency;
	static JMD: Currency;
	static JOD: Currency;
	static JPY: Currency;
	static KES: Currency;
	static KHR: Currency;
	static KMF: Currency;
	static KRW: Currency;
	static KWD: Currency;
	static KZT: Currency;
	static LAK: Currency;
	static LBP: Currency;
	static LKR: Currency;
	static LTL: Currency;
	static LVL: Currency;
	static LYD: Currency;
	static MAD: Currency;
	static MDL: Currency;
	static MGA: Currency;
	static MKD: Currency;
	static MMK: Currency;
	static MOP: Currency;
	static MUR: Currency;
	static MXN: Currency;
	static MYR: Currency;
	static MZN: Currency;
	static NAD: Currency;
	static NGN: Currency;
	static NIO: Currency;
	static NOK: Currency;
	static NPR: Currency;
	static NZD: Currency;
	static OMR: Currency;
	static PAB: Currency;
	static PEN: Currency;
	static PHP: Currency;
	static PKR: Currency;
	static PLN: Currency;
	static PYG: Currency;
	static QAR: Currency;
	static RON: Currency;
	static RSD: Currency;
	static RUB: Currency;
	static RWF: Currency;
	static SAR: Currency;
	static SDG: Currency;
	static SEK: Currency;
	static SGD: Currency;
	static SOS: Currency;
	static SYP: Currency;
	static THB: Currency;
	static TND: Currency;
	static TOP: Currency;
	static TRY: Currency;
	static TTD: Currency;
	static TWD: Currency;
	static TZS: Currency;
	static UAH: Currency;
	static UGX: Currency;
	static UYU: Currency;
	static UZS: Currency;
	static VEF: Currency;
	static VND: Currency;
	static XAF: Currency;
	static XOF: Currency;
	static YER: Currency;
	static ZAR: Currency;
	static ZMK: Currency;
	//#endregion
}
declare namespace Money {
}
declare module 'js-money' {
	export = Money;
}
declare interface CurrencyObjects {
	[key: string]: Currency;
	USD: Currency;
	CAD: Currency;
	EUR: Currency;
	BTC: Currency;
	AED: Currency;
	AFN: Currency;
	ALL: Currency;
	AMD: Currency;
	ARS: Currency;
	AUD: Currency;
	AZN: Currency;
	BAM: Currency;
	BDT: Currency;
	BGN: Currency;
	BHD: Currency;
	BIF: Currency;
	BND: Currency;
	BOB: Currency;
	BRL: Currency;
	BWP: Currency;
	BYR: Currency;
	BZD: Currency;
	CDF: Currency;
	CHF: Currency;
	CLP: Currency;
	CNY: Currency;
	COP: Currency;
	CRC: Currency;
	CVE: Currency;
	CZK: Currency;
	DJF: Currency;
	DKK: Currency;
	DOP: Currency;
	DZD: Currency;
	EEK: Currency;
	EGP: Currency;
	ERN: Currency;
	ETB: Currency;
	GBP: Currency;
	GEL: Currency;
	GHS: Currency;
	GNF: Currency;
	GTQ: Currency;
	HKD: Currency;
	HNL: Currency;
	HRK: Currency;
	HUF: Currency;
	IDR: Currency;
	ILS: Currency;
	INR: Currency;
	IQD: Currency;
	IRR: Currency;
	ISK: Currency;
	JMD: Currency;
	JOD: Currency;
	JPY: Currency;
	KES: Currency;
	KHR: Currency;
	KMF: Currency;
	KRW: Currency;
	KWD: Currency;
	KZT: Currency;
	LAK: Currency;
	LBP: Currency;
	LKR: Currency;
	LTL: Currency;
	LVL: Currency;
	LYD: Currency;
	MAD: Currency;
	MDL: Currency;
	MGA: Currency;
	MKD: Currency;
	MMK: Currency;
	MOP: Currency;
	MUR: Currency;
	MXN: Currency;
	MYR: Currency;
	MZN: Currency;
	NAD: Currency;
	NGN: Currency;
	NIO: Currency;
	NOK: Currency;
	NPR: Currency;
	NZD: Currency;
	OMR: Currency;
	PAB: Currency;
	PEN: Currency;
	PHP: Currency;
	PKR: Currency;
	PLN: Currency;
	PYG: Currency;
	QAR: Currency;
	RON: Currency;
	RSD: Currency;
	RUB: Currency;
	RWF: Currency;
	SAR: Currency;
	SDG: Currency;
	SEK: Currency;
	SGD: Currency;
	SOS: Currency;
	SYP: Currency;
	THB: Currency;
	TND: Currency;
	TOP: Currency;
	TRY: Currency;
	TTD: Currency;
	TWD: Currency;
	TZS: Currency;
	UAH: Currency;
	UGX: Currency;
	UYU: Currency;
	UZS: Currency;
	VEF: Currency;
	VND: Currency;
	XAF: Currency;
	XOF: Currency;
	YER: Currency;
	ZAR: Currency;
	ZMK: Currency;
}
declare var S: CurrencyObjects;
declare namespace S { }
declare module 'js-money/lib/currency' {
	export = S;
}