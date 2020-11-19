import { is, validate, ensure } from "..";

export { Test };

class Test {
    @validate()
    public testNumberGtZero(@is((v) => v > 0, "number") value: number): number {
        return value;
    }

    @validate()
    public testTwoNumbers(@is((v) => v > 0) value: number, @is((v) => v >= 5) value3: number): number {
        return value + value3;
    }

    @validate()
    public testThreeNumbers(
        @is((v) => v > 0) value: number,
        value2: number,
        @is((v) => v >= 5) value3: number
    ): number {
        return value + value2 + value3;
    }

    @validate()
    public testArrayLengthGteThree(@is((a) => a.length >= 3) array: number[]) {
        return array;
    }

    @validate()
    public testArraySumGteTen(@is((a: number[]) => a.reduce((p, c) => p + c) >= 10) array: number[]) {
        return array;
    }

    @validate()
    public testStringSaysHi(@is((a: string) => a == "Hi") str: string) {
        return str;
    }

    @validate()
    public testStringSaysHiWithAlias(@ensure((a: string) => a == "Hi", "string") str: string) {
        return str;
    }

    @validate({ argFn: (a, b) => b > a })
    public testCheckingAllArgs(smallNum: number, largeNum: number) {
        return smallNum + largeNum;
    }

    public FieldA = 3;

    @validate({
        contextFn: (context: Test, a, b) => a + b > context.FieldA,
    })
    public testContextAwareAllArgCheck(smallNum: number, largeNum: number) {
        return smallNum + largeNum;
    }

    @validate()
    public testInputGreaterThanFieldA(@is<Test>((a, context) => a > context.FieldA) num: number) {
        return num;
    }


}
