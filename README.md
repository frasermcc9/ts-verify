# Verify-TS 
[![NPM Version](https://img.shields.io/npm/v/ts-verify.svg?style=flat)](https://www.npmjs.com/package/ts-verify)

This package provides a decorator to help with verifying input to methods.
## Install
```
npm i ts-verify
```

## TypeScript Usage
To use in typescript, import the functions. 
```ts
import { is, validate } from "ts-verify";
```
To verify parameters of a method, use like this:
```ts
@validate()
public testOneNumber(@is((v) => v > 0) value: number): number {
    return value;
}
```
In this example, the value parameter will throw an exception if a number is pased that is not greater than 0.

We can use any function that returns a boolean value:
```ts
@validate()
public testArraySumGteTen(
    @is((a: number[]) => a.reduce((p, c) => p + c) >= 10) array: number[]
) {
     return array;
}
```
This will throw if the passed array of numbers does not sum to at least 10.

## Type Checking
You can also ensure types are correct:
```ts
@validate()
public donate(@is((v) => v > 0, "number") value: number) {
    //..
}
```
Without the additional `"number"` parameter, the following would be valid:
```ts
donate("4");
```
However, with this additional checking, the above will throw.

<br>

# Complete Example
```ts
class RandomGenerator {

    @validate()
    public nextInt(
        @is((v) => v >= 0, "number") min: number,
        @is((v) => v >= 0, "number") max: number
    ): number {
        return ~~(Math.random() * (max - min) + min);
    }

}
```