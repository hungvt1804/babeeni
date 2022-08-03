import { BaseLayer } from "../layers/BaseLayer";

export class Support {
    private static firstGraphic: any = null;
    private static secondGraphic: any = null;
    private static shapeGraphic: any = null;
    private static shapeNoFilledGraphic: any = null;
    static isObject(item: any): boolean {
        return item && typeof item === "object" && !Array.isArray(item);
    }
    static mergeDeep(target: any, ...sources: any): any {
        if (!sources.length) return target;
        const source = sources.shift();

        if (Support.isObject(target) && Support.isObject(source)) {
            for (const key in source) {
                if (Support.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    Support.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return Support.mergeDeep(target, ...sources);
    }
    static objectMap(object: any, mapFn: any) {
        return Object.keys(object).reduce(function (result: any, key: string) {
            result[key] = mapFn(key, object[key]);
            return result;
        }, {});
    }
    static getInstanceFirstGraphic(p5: any, mode: any) {
        if (!Support.firstGraphic) {
            Support.firstGraphic = p5.createGraphics(500, 500);
        }
        if (!mode) {
            mode = p5.CENTER;
        }
        Support.firstGraphic.imageMode(mode);
        return Support.firstGraphic;
    }
    static getInstanceSecondGraphic(p5: any, mode: any) {
        if (!Support.secondGraphic) {
            Support.secondGraphic = p5.createGraphics(500, 500);
        }
        if (!mode) {
            mode = p5.CENTER;
        }
        Support.secondGraphic.imageMode(mode);
        return Support.secondGraphic;
    }
    static getInstanceShapeGraphic(p5: any, mode: any) {
        if (!Support.shapeGraphic) {
            Support.shapeGraphic = p5.createGraphics(500, 500);
            // if (!mode) {
            //     mode = p5.CENTER;
            // }
            // Support.shapeGraphic.imageMode(mode);
        }
        Support.shapeGraphic.clear();
        return Support.shapeGraphic;
    }
    static getInstanceShapeNoFillGraphic(p5: any, mode: any) {
        if (!Support.shapeNoFilledGraphic) {
            Support.shapeNoFilledGraphic = p5.createGraphics(500, 500);
            // if (!mode) {
            //     mode = p5.CENTER;
            // }
            // Support.shapeGraphic.imageMode(mode);
        }
        return Support.shapeNoFilledGraphic;
    }
}
