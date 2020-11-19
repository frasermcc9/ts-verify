// Copyright 2020 Fraser
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import "reflect-metadata";
import ValidationError from "../util/ValidationError";

/**
 * Mark this method for validation checking. This will allow any parameter
 * decorators that are marked with the `@is` annotation to be checked. It can
 * also have its own validation function passed.
 *
 * @param fullValidator Optional parameter that takes a function as input. The
 * function is wrapped in an object, with two types:
 * ```ts
 * {argFn:(...) => boolean}
 *  ```
 * takes in *n* parameters, one for each parameter of the decorated method.
 * ```ts
 * {contextFn:(...) => boolean}
 * ```
 * takes in *n+1* parameters, where the first is a parameter containing the
 * object that this method is being called on. The following arguments are the
 * method parameters.
 *
 * @since 1.0.0
 * @version 1.0.5
 * @author Fraser
 */
export function validate(fullValidator?: FullValidator) {
    return function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
        // get metadata
        const params: number[] = Reflect.getOwnMetadata("name", target, key) || [];
        const validators: ((value: any, context: any) => boolean)[] =
            Reflect.getOwnMetadata("validator", target, key) || [];
        const types: string[] = Reflect.getOwnMetadata("types", target, key) || [];

        const method = descriptor.value;
        descriptor.value = function (...args: any) {
            //First check full validators
            if (fullValidator != undefined) {
                if (fullValidator.argFn && !fullValidator.argFn(...args)) {
                    throw new ValidationError(
                        `Full validation check failed for method '${method}', with validator '${fullValidator} and arguments ${args}.'`
                    );
                }
                if (fullValidator.contextFn && !fullValidator.contextFn(this, ...args)) {
                    throw new ValidationError(
                        `Full validation check failed for method '${method}', with validator '${fullValidator} and arguments ${args}.'`
                    );
                }
            }

            // Iterate through parameters and check manual '@is' validators
            for (const p of params) {
                const validator = validators[p];
                const arg = args[p];
                const type = types[p];

                // checking validator function
                if (validator(arg, this) !== true) {
                    throw new ValidationError(`Invalid Argument '${arg}' for validator '${validator}.'`);
                }
                // checking optional type validator
                if (type != undefined && typeof arg !== type) {
                    throw new ValidationError(`Invalid Argument '${arg}' for validator '${validator}.'`);
                }
            }
            return method.apply(this, args);
        };
    };
}

/**
 * The types of validation functions for the validate validation method.
 * @author Fraser
 * @since 1.0.5
 * @version 1.0.5
 */
interface FullValidator {
    /**
     * Function that will be passed the parameters that the method is given.
     * @example
     *  class MyClass{
     *      //at sign was omitted due to JSDoc conflict
     *      validate({ argFn: (a, b, c) => a + b + c > 10 })
     *      public test(first: number, second: number, third: number) {
     *          //Omitted
     *      }
     *  }
     */
    argFn?: (...args: any) => boolean;
    /**
     * Function that will be passed the parameters that the method is given, as
     * well as the object the method is being called on.
     * @example
     * class MyClass {
     *      myValue:number = 3;
     *
     *      //at sign was omitted due to JSDoc conflict
     *      validate({ contextFn: (context: MyClass, a, b) => a + b + context.myValue > 10 })
     *      public test(first: number, second: number) {
     *          //Omitted
     *      }
     * }
     */
    contextFn?: (context: any, ...args: any) => boolean;
}
