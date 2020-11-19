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
class PaymentProvider {
    @validate()
    public pay(@is((v) => v > 0, "number") value: number) {
        // Omitted
    }
}

```
Without the additional `"number"` parameter, the following would be valid:
```ts
pay("4");
```
However, with this additional checking, the above will throw.

Alternatively, you can just check for a type:
```ts
class MyClass {
    @validate()
    public thisIsAString(@is("string") myString: string) {
        // Omitted
    }
}
```

## Contextual Checking
Validation functions can access the object the method is being called on:
```ts
class Player {
    private energy: number = 50;
    @validate()
    public doAction(@is((e, context:Player) => energy >= e) energyCost: number): void {
        // Omitted
    }
}
```
The optional second parameter to an `@is` call will pass a reference to the
object. We can therefore access methods and fields on this object. For
typechecking, either the function or parameter must have a type
parameter/annotation, i.e.:
```ts
@is<Player>((e, context) => ... )
```
or
```ts
@is((e,context:Player) => ... )
```

## Full Method Checking
A validation function can be called inside the `@validate()` call as well. This
function has access to all arguments in the method, for example:
```ts
class RandomGenerator {
    @validate({ argFn: (a, b) => a < b })
    public nextInt(@is("number") min: number, @is("number") max: number): number {
        return ~~(Math.random() * (max - min) + min);
    }
}
```
The order of the arguments in the validation function is the same order as
passed in the method. In this example, `a` would be `min`, and `b` would be
`max`.


The validation function inside `@validate()` can also access the object context.
Note the name of the argument inside the object passed to `@validate()`:
```ts
class SpaceMission {
    private fuel = 100;

    @validate({ contextFn: (context, a, b) => a + b <= context.fuel })
    public launch(fuelToDestination: number, fuelToReturn: number) {
        // Omitted
    }
}
```
The first parameter to `contextFn` is the object. The remaining are the method
arguments. This can be contrasted to `argFn` which just passes the arguments.
For a more complete example:
```ts
class SpaceMission {
    private fuel = 100;

    @validate({ contextFn: (context, a, b) => a + b <= context.fuel })
    public launch(
        @is((f) => f > 0, "number") fuelToDestination: number,
        @is((f) => f > 0, "number") fuelToReturn: number
    ) {
        // Omitted
    }
}
```