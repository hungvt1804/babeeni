import { P5Helper } from "../helpers/P5Helper";

export class GroupLayer {
    private layers: any;
    constructor(layers: any) {
        this.layers = layers;
        let proxyLayer = new Proxy(this, this.magicMethods());
        proxyLayer.layers = layers;
        return proxyLayer;
    }
    __get(property: any) {
        let results: any = {};
        for (const [key, item] of Object.entries(this.layers)) {
            let value = null;
            if (typeof (item as any)[property] == "function") {
                return function (...args: any) {
                    return (item as any)[property].apply(item, args);
                };
            }
            // else if (typeof (item as any)[property] == "string") {
            else {
                value = (item as any)[property];
            }

            results[key] = value;
        }
        return results;
    }

    __set(property: any, value: any) {
        for (const [key, item] of Object.entries(this.layers)) {
            (item as any)[property] = value;
        }
        P5Helper.setDirty(true);
    }
    __apply(thisArg: any, argumentsList: any) {
        console.log(thisArg, argumentsList);
    }

    magicMethods() {
        return {
            get(target: any, property: any) {
                return target.__get(property);
            },
            set(target: any, property: any, value: any) {
                try {
                    target.__set(property, value);
                    return true;
                } catch (error) {
                    throw error;
                }
            },
            apply: function (target: any, thisArg: any, argumentsList: any) {
                return target.__apply(thisArg, argumentsList);
            },
        };
    }
}
