import { Test } from "./Test";
import { expect } from "chai";

describe("Validator Function Tests", () => {
    let test: Test = new Test();

    describe("Single Number Parameter Method", () => {
        it("Should execute the single parameter number method", () => {
            expect(test.testNumberGtZero(5)).to.equal(5);
        });

        it("Should reject invalid input to single parameter number method", () => {
            expect(() => test.testNumberGtZero(-5)).to.throw();
        });
    });

    describe("Two Number Parameter Method", () => {
        it("Should execute the two parameter number method", () => {
            expect(test.testTwoNumbers(5, 5)).to.equal(10);
        });

        it("Should reject the two parameter number method where first input is invalid", () => {
            expect(() => test.testTwoNumbers(0, 10)).to.throw();
        });

        it("Should reject the two parameter number method where second input is invalid", () => {
            expect(() => test.testTwoNumbers(5, 4)).to.throw();
        });

        it("Should reject the two parameter number method where both inputs are invalid", () => {
            expect(() => test.testTwoNumbers(0, 0)).to.throw();
        });
    });

    describe("Three Number Parameter Method", () => {
        it("Should execute the three parameter number method", () => {
            expect(test.testThreeNumbers(5, 5, 10)).to.equal(20);
        });

        it("Should reject the three parameter number method where first input is invalid", () => {
            expect(() => test.testThreeNumbers(0, 10, 10)).to.throw();
        });

        it("Should reject the three parameter number method where third input is invalid", () => {
            expect(() => test.testThreeNumbers(5, 4, 3)).to.throw();
        });

        it("Should reject the three parameter number method where both inputs are invalid", () => {
            expect(() => test.testThreeNumbers(0, 0, 0)).to.throw();
        });

        it("Unchecked second parameter should not fail", () => {
            expect(test.testThreeNumbers(1, -100, 6)).to.equal(-93);
        });
    });

    describe("Array Tests", () => {
        it("Should accept valid array length", () => {
            const arr = [3, 4, 5];
            expect(test.testArrayLengthGteThree(arr)).to.equal(arr);
        });

        it("Should reject invalid array length", () => {
            const arr = [4, 5];
            expect(() => test.testArrayLengthGteThree(arr)).to.throw();
        });

        it("Should accept valid array sum size", () => {
            const arr = [3, 4, 5];
            expect(test.testArraySumGteTen(arr)).to.equal(arr);
        });

        it("Should reject invalud array sum size", () => {
            const arr = [3, 3, 3];
            expect(() => test.testArraySumGteTen(arr)).to.throw();
        });
    });

    describe("String tests", () => {
        it("Should accept the valid string", () => {
            expect(test.testStringSaysHi("Hi")).to.equal("Hi");
        });
        it("Should reject invalid string", () => {
            expect(() => test.testStringSaysHi("hi")).to.throw();
        });
        it("Should accept the alias", () => {
            expect(test.testStringSaysHiWithAlias("Hi")).to.equal("Hi");
        });
        it("Should deny the alias with invalid input", () => {
            expect(() => test.testStringSaysHiWithAlias("hi")).to.throw();
        });
    });
});

describe("Faulty types", () => {
    it("Should reject faulty types", () => {
        let test: Test = new Test();
        //@ts-expect-error
        expect(() => test.testNumberGtZero("4")).to.throw();
    });

    it("Should accept regular types", () => {
        let test: Test = new Test();
        expect(test.testNumberGtZero(4)).to.equal(4);
    });
});
