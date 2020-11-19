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

/**
 * Parameter decorator for ensuring valid input. To ensure type equality, ensure
 * that strict equals is used where possible. Optional second argument can be
 * given to ensure type equality as well as regular equality.
 *
 * @param validator function that takes a single parameter: the input variable.
 * The function should return true if the input is acceptable.
 *
 * The second parameter, if desired, can also be used. It contains a reference
 * to the object containing this method, if you would like to validate the
 * condition of something (like a field) in the object.
 *
 * @param type the type that the input must be
 *
 */
export function is<T>(
    validator: (value: any, context: T) => boolean,
    type?: Type
) {
    return function (
        target: Object,
        propertyName: string,
        index: number
    ): void {
        const params: number[] =
            Reflect.getOwnMetadata("name", target, propertyName) || [];
        let validators =
            Reflect.getOwnMetadata("validator", target, propertyName) || [];
        let types = Reflect.getOwnMetadata("types", target, propertyName) || [];

        params.push(index);
        validators[index] = validator;
        if (type != undefined) {
            types[index] = type;
        }

        Reflect.defineMetadata("name", params, target, propertyName);
        Reflect.defineMetadata("validator", validators, target, propertyName);
        Reflect.defineMetadata("types", types, target, propertyName);
    };
}

/**
 * Alias for {@see is}
 */
export const ensure = is;

/**
 * Valid types to check for
 */
type Type =
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "symbol"
    | "undefined"
    | "object"
    | "function";
