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

export function is(validator: (value: any) => boolean) {
    return function (target: Object, propertyName: string, index: number): void {
        const params: number[] = Reflect.getOwnMetadata("name", target, propertyName) || [];
        let validators = Reflect.getOwnMetadata("validator", target, propertyName) || [];

        params.push(index);
        validators[index] = validator;

        Reflect.defineMetadata("name", params, target, propertyName);
        Reflect.defineMetadata("validator", validators, target, propertyName);
    };
}
