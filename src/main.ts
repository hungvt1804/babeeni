import { FullInfoP5 } from "./base/FullInfoP5s";
import { InfoP5 } from "./base/InfoP5";
import Tech5sP5 from "./base/Tech5sP5";
import { CurrentManager } from "./classes/CurrentManager";
import * as ExportImage from "html-to-image";
import { P5Helper } from "./helpers/P5Helper";
import { Support } from "./helpers/Support";
import { FontLoader } from "./loader/FontLoader";
import { ImageLoader } from "./loader/ImageLoader";
import { LayerLoader } from "./loader/LayerLoader";

declare const p5: any;

let globalP5Canvas: any;
export const makeBabee = function (config: string, options: {}) {
    const defaultOptions = {
        loop: true,
    };
    options = Support.mergeDeep(defaultOptions, options);
    var p5Canvas = function (p5: any) {
        var tmp = ((window as any).Tech5sFabric = new Tech5sP5(
            p5,
            config,
            options
        ));
        p5.preload = () => {
            tmp.preload();
        };
        p5.setup = () => {
            tmp.setup();
        };
        p5.draw = () => {
            tmp.draw();
        };
        p5.keyPressed = (e: any) => {
            tmp.keyPressed(e);
        };
    };
    if (globalP5Canvas) {
        globalP5Canvas.remove();
    }
    globalP5Canvas = new p5(p5Canvas);
    return globalP5Canvas;
};
export {
    LayerLoader,
    ImageLoader,
    P5Helper,
    FontLoader,
    CurrentManager,
    InfoP5,
    FullInfoP5,
    ExportImage,
};
