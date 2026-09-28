# @js-fns/decimal

FixedDecimal is a tiny decimal class for JavaScript.

It solves the main problem with the IEEE 754 floats (the notorious `0.1 + 0.2 == 0.30000000000000004`) without implementing an arbitrary-precision type that is more accurate but also heavier.

FixedDecimal is **just `0.5 kB`** and has no dependencies, while [`decimal.js`](https://github.com/MikeMcl/decimal.js) is `12.3 kB`. In most cases, including working with money, the precision provided by `decimal.js` is irrelevant, so FixedDecimal is an excellent alternative.

## Migrating from TinyFloat

The package was previously published as [TinyFloat](https://github.com/kossnocorp/tinyfloat). The @js-fns/decimal version is identical, with only the class name changed from `TinyFloat` to `FixedDecimal`.

Migrate to it to receive future updates. It's easy:

1. Install the `@js-fns/decimal` package.
2. Replace all `TinyFloat` strings with `FixedDecimal` to update the class references.
3. Replace all `tinyfloat` strings with `@js-fns/decimal` to update the imports.

## Installation

The package is available as a standalone npm package:

```sh
npm install @js-fns/decimal
```

It is also available as a part of the `js-fns` collection:

```sh
npm install js-fns
```

## Usage

The library exports the `FixedDecimal` class, which you can use to create decimal numbers:

```ts
import { FixedDecimal } from "@js-fns/decimal"; // Or "js-fns/decimal"

new FixedDecimal("0.1").add("0.2").toNumber();
//=> 0.3
```

You can also set the precision for the `FixedDecimal` instance:

```ts
new FixedDecimal("0.123456", 2).toNumber();
//=> 0.12

new FixedDecimal("0.987654321", 2).toNumber();
//=> 0.99
```

## API

The `FixedDecimal` class has basic arithmetic methods:

- `add` - adds two numbers
- `sub` - subtracts two numbers
- `mul` - multiplies two numbers
- `div` - divides two numbers
- `mod` - returns the remainder of the division

All methods accept strings, numbers, and FixedDecimal instances:

```ts
new FixedDecimal("0.1").add(new FixedDecimal("0.2")).toNumber();
// Or pass a string:
new FixedDecimal("0.1").add("0.2").toNumber();
// Or a number:
new FixedDecimal(0.1).add(0.2).toNumber();
```

To convert a `FixedDecimal` instance to a number, use the `toNumber` method:

```ts
new FixedDecimal("0.1").add("0.2").toNumber();
//=> 0.3
```

To convert the `FixedDecimal` instance to a string, use the `toString` method:

```ts
new FixedDecimal("0.1").add("0.2").toString();
//=> "0.3000000000000000"
```

The method pads the number with zeros to the set precision (default is 16).

Both `toString` and `toNumber` accept custom precision, effectively rounding the number to the given number of digits after the decimal point:

```ts
const tf = new FixedDecimal("1").div("1.5");
//=> 0.6666666666666667⁠​​​​​​

tf.toString(2);
//=> "0.67"

tf.toNumber(0);
//=> 1
```

## Benchmark

[The benchmark](./_bench.pkg/bench.ts) shows that FixedDecimal is significantly faster than other popular libraries for decimal arithmetic:

```
constructor:
┌─────────┬───────────────────┬───────────────────┐
│ (index) │ Package           │ ops/s             │
├─────────┼───────────────────┼───────────────────┤
│ 1       │ '@js-fns/decimal' │ '9,024,836 ± 521' │
│ 2       │ 'decimal.js'      │ '2,296,855 ± 428' │
│ 3       │ 'currency.js'     │ '1,471,937 ± 187' │
└─────────┴───────────────────┴───────────────────┘
add:
┌─────────┬───────────────────┬──────────────────────┐
│ (index) │ Package           │ ops/s                │
├─────────┼───────────────────┼──────────────────────┤
│ 1       │ '@js-fns/decimal' │ '29,523,009 ± 1,698' │
│ 2       │ 'decimal.js'      │ '4,587,360 ± 269'    │
│ 3       │ 'currency.js'     │ '2,952,507 ± 238'    │
└─────────┴───────────────────┴──────────────────────┘
sub:
┌─────────┬───────────────────┬──────────────────────┐
│ (index) │ Package           │ ops/s                │
├─────────┼───────────────────┼──────────────────────┤
│ 1       │ '@js-fns/decimal' │ '28,928,579 ± 1,745' │
│ 2       │ 'decimal.js'      │ '4,991,355 ± 302'    │
│ 3       │ 'currency.js'     │ '3,063,298 ± 232'    │
└─────────┴───────────────────┴──────────────────────┘
mul:
┌─────────┬───────────────────┬────────────────────┐
│ (index) │ Package           │ ops/s              │
├─────────┼───────────────────┼────────────────────┤
│ 1       │ '@js-fns/decimal' │ '11,787,963 ± 862' │
│ 2       │ 'decimal.js'      │ '4,157,716 ± 243'  │
│ 3       │ 'currency.js'     │ '2,504,444 ± 207'  │
└─────────┴───────────────────┴────────────────────┘
mod:
┌─────────┬───────────────────┬──────────────────────┐
│ (index) │ Package           │ ops/s                │
├─────────┼───────────────────┼──────────────────────┤
│ 1       │ '@js-fns/decimal' │ '22,278,688 ± 1,171' │
│ 2       │ 'decimal.js'      │ '1,721,449 ± 327'    │
└─────────┴───────────────────┴──────────────────────┘
```

## Changelog

See [the changelog](./CHANGELOG.md).

## License

[MIT © Sasha Koss](https://kossnocorp.mit-license.org/)
