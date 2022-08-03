import { Support } from "../helpers/Support";
import { LayerLoader } from "../loader/LayerLoader";

export abstract class BaseLayer {
    static WIDTH: number = 0;
    static HEIGHT: number = 0;
    protected moveable = false;
    protected moveOffsetX = 0;
    protected moveOffsetY = 0;
    private _p5: any;
    public get p5(): any {
        return this._p5;
    }
    public set p5(value: any) {
        this._p5 = value;
    }
    private _layerConfig: any;
    public get layerConfig(): any {
        return this._layerConfig;
    }
    public set layerConfig(value: any) {
        this._layerConfig = value;
    }
    private _layerName: string;

    public get layerName(): string {
        return this._layerName;
    }

    public set layerName(value: string) {
        this._layerName = value;
    }
    private _layerText: string;
    public get layerText(): string {
        return this._layerText;
    }
    public set layerText(value: string) {
        this._layerText = value;
    }
    private _positionBase: any;
    public get positionBase(): any {
        return this._positionBase;
    }
    public set positionBase(value: any) {
        this._positionBase = value;
    }
    private _groupName: any;
    public get groupName(): any {
        return this._groupName;
    }
    public set groupName(value: any) {
        this._groupName = value;
    }
    private _startPoint: any = { x: 0, y: 0 };
    public get startPoint(): any {
        return this._startPoint;
    }
    public set startPoint(value: any) {
        this._startPoint = value;
    }
    private _forbidden: boolean = false;
    public get forbidden(): boolean {
        return this._forbidden;
    }
    public set forbidden(value: boolean) {
        this._forbidden = value;
    }

    constructor(p5: any, layerConfig: any, positionBase: any) {
        this.p5 = p5;
        this.layerConfig = layerConfig;
        this.layerName = layerConfig.name || "base";
        this.layerText = layerConfig.text || "base";
        this.groupName = layerConfig.group || "";
        this.forbidden = layerConfig.forbidden || false;
        this.positionBase = positionBase;
        BaseLayer.WIDTH = this.p5.width;
        BaseLayer.HEIGHT = this.p5.height;
    }
    public applyHistory(layerConfig: any) {
        this.forbidden = layerConfig.forbidden;
        this.layerName = layerConfig.name || "base";
        this.layerText = layerConfig.text || "base";
        this.groupName = layerConfig.group || "";
    }
    abstract render(): void;
    public setup(): void {}
    public move(): void {
        if (this.p5.keyIsDown(this.p5.LEFT_ARROW)) {
            this.moveOffsetX -= 1;
        }
        if (this.p5.keyIsDown(this.p5.RIGHT_ARROW)) {
            this.moveOffsetX += 1;
        }
        if (this.p5.keyIsDown(this.p5.UP_ARROW)) {
            this.moveOffsetY -= 1;
        }
        if (this.p5.keyIsDown(this.p5.DOWN_ARROW)) {
            this.moveOffsetY += 1;
        }
    }
    protected isMoveable() {
        return (
            this.moveable &&
            LayerLoader.CURRENT_LAYER_MOVEABLE == this.layerName
        );
    }
    public getMovedPosition() {
        const x = this.startPoint.x - this.positionBase.x + this.moveOffsetX;
        const y = this.startPoint.y - this.positionBase.y + this.moveOffsetY;
        return {
            x,
            y,
        };
    }
    protected getStartPoint(image: any) {
        const position = this.layerConfig.position || "center";
        if (position == "center") {
            const imageWidth = image.width;
            const imageHeight = image.height;
            const canvasWidth = this.p5.width;
            const canvasHeight = this.p5.height;
            return {
                x: (canvasWidth - imageWidth) / 2,
                y: (canvasHeight - imageHeight) / 2,
            };
        } else if (position == "point") {
            var point = this.layerConfig.point;
            var finalPoint = {
                x: point.x + this.positionBase.x,
                y: point.y + this.positionBase.y,
            };
            return finalPoint;
        }
    }
    public toJsonable(): any {
        const position = this.layerConfig.position || "center";
        const enable = this.layerConfig.enable && true;
        const optinal: any = {};
        if (position == "point") {
            const point = this.layerConfig.point || "";
            if (point != "") {
                const movePosition = this.getMovedPosition();
                optinal.point = movePosition;
            }
        }
        const angle = this.layerConfig.angle || "";
        if (angle != "") {
            optinal.angle = angle;
        }
        const image = this.layerConfig.image || "";
        if (image != "") {
            optinal.image = image;
        }
        const group = this.layerConfig.group || "";
        if (group != "") {
            optinal.group = group;
        }
        const draw = this.layerConfig.draw || "";
        if (draw != "") {
            optinal.draw = draw;
        }
        const type = this.layerConfig.type || "";
        if (type != "") {
            optinal.type = type;
        }
        const order = this.layerConfig.order || "";
        if (type != "") {
            optinal.order = order;
        }

        const base = {
            name: this.layerName,
            text: this.layerText,
            position: position,
            enable: enable,
            forbidden: this.forbidden,
        };
        return Support.mergeDeep(base, optinal);
    }
    public toHistoryObject() {
        const base = this.toJsonable();
        base.forbidden = this.forbidden;
        return base;
    }
}
