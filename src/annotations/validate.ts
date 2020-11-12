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
import { deepStrictEqual } from "assert";

export function validate() {
    return function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
        const params: number[] = Reflect.getOwnMetadata("name", target, key) || [];
        const validators: ((value: any) => boolean)[] = Reflect.getOwnMetadata("validator", target, key) || [];

        const method = descriptor.value;
        descriptor.value = function (...args: any) {
            for (const p of params) {
                const validator = validators[p];
                const arg = args[p];
                try {
                    deepStrictEqual(validator(arg), true);
                } catch (e) {
                    throw new TypeError(`Invalid Argument '${arg}' for validator '${validator}.' Threw with ${e}.`);
                }
            }
            return method.apply(this, args);
        };
    };
}
