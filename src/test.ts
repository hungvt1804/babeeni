import Tech5sP5 from "./base/Tech5sP5";
declare const p5: any;
export var makeBabee = function (config: string) {
    var p5Canvas = function (p5: any) {
        var tmp = ((window as any).Tech5sFabric = new Tech5sP5(p5, config));
        let gach: any;
        let pg: any;
        p5.preload = () => {
            tmp.preload();
        };
        p5.setup = () => {
            tmp.setup();
        };
        p5.draw = () => {
            tmp.draw();
        };
    };
    return new p5(p5Canvas);
};
