import { P5Helper } from "../helpers/P5Helper";
import { Support } from "../helpers/Support";
import { ImageLoader } from "../loader/ImageLoader";
import { LayerLoader } from "../loader/LayerLoader";
import { BaseLayer } from "./BaseLayer";
import { SimpleLayer } from "./SimpleLayer";

export class ImageLayer extends SimpleLayer {
    protected moveable = true;
    private _imageObject: any;
    public get imageObject(): any {
        return this._imageObject;
    }
    public set imageObject(value: any) {
        this._imageObject = value;
    }

    private _imageDraw: any;
    public get imageDraw(): any {
        return this._imageDraw;
    }
    public set imageDraw(value: any) {
        this._imageDraw = value;
    }

    protected graphic: any;
    protected angle: number = 0;
    constructor(p5: any, layerConfig: any, positionBase: any) {
        super(p5, layerConfig, positionBase);
        this.angle = this.layerConfig.angle || 0;
        this.__initGraphic();
        if (ImageLoader.hasImage(this.layerName)) {
            this.imageObject = ImageLoader.getImageByName(this.layerName);
            const image = this.imageObject.image;
            this.startPoint = this.getStartPoint(image);
        }
    }
    protected __initGraphic() {
        if (this.angle != 0) {
            this.graphic = this.p5.createGraphics(
                BaseLayer.WIDTH,
                BaseLayer.HEIGHT
            );
            this.graphic.imageMode(this.graphic.CENTER);
        }
    }
    public applyHistory(layerConfig: any) {
        super.applyHistory(layerConfig);
        if (layerConfig.imageDraw) {
            this.imageDraw = layerConfig.imageDraw;
        }
    }

    public render() {
        if (this.forbidden) return;
        this._clearGraphic();
        if (this.imageObject) {
            let baseImage = this.imageObject.image;
            let image = baseImage;
            if (this.imageDraw) {
                image = this.imageDraw;
            }
            if (image) {
                let sx = this.startPoint.x;
                let sy = this.startPoint.y;
                if (this.isMoveable()) {
                    this.move();
                    sx += this.moveOffsetX;
                    sy += this.moveOffsetY;
                }

                const drawSize = this.getWidthHeightDraw(baseImage);
                if (this.angle != 0) {
                    const imageWidth = baseImage.width;
                    const imageHeight = baseImage.height;

                    this.rotateImage(
                        this.graphic,
                        this.angle,
                        baseImage,
                        drawSize
                    );
                    this.p5.image(
                        this.graphic,
                        -BaseLayer.WIDTH / 2 + sx + imageWidth / 2,
                        -BaseLayer.HEIGHT / 2 + sy + imageHeight / 2
                    );
                } else {
                    this.p5.image(
                        image,
                        sx,
                        sy,
                        drawSize.width,
                        drawSize.height
                    );
                }
            }
        }
    }
    protected _clearGraphic() {
        if (this.graphic) {
            this.graphic.clear();
            this.graphic.background(0, 0, 0, 0);
        }
    }
    protected rotateImage(graphic: any, angle: any, image: any, drawSize: any) {
        angle = (angle * this.p5.PI) / 180;
        graphic
            .resetMatrix()
            .translate(BaseLayer.WIDTH / 2, BaseLayer.HEIGHT / 2)
            .rotate(angle);
        graphic.image(image, 0, 0, drawSize.width, drawSize.height);
    }

    protected getWidthHeightDraw(image: any) {
        const width = image.width;
        const height = image.height;
        const drawConfig = this.layerConfig.draw || {
            type: "ratio",
            percent: 100,
        };
        const ratioType = drawConfig.type || "ratio";

        if (ratioType == "ratio") {
            const percent = drawConfig.percent;
            return {
                width: (width * percent) / 100,
                height: (height * percent) / 100,
            };
        } else if (ratioType == "fixed") {
            const newWidth = drawConfig.width || width;
            const newHeight = drawConfig.height || height;
            return {
                width: newWidth,
                height: newHeight,
            };
        } else if (ratioType == "fixHeight") {
            const newHeight = drawConfig.height || height;
            const newWidth = (width * newHeight) / height;
            return {
                width: newWidth,
                height: newHeight,
            };
        } else if (ratioType == "fixWidth") {
            const newWidth = drawConfig.width || width;
            const newHeight = (height * newWidth) / width;
            return {
                width: newWidth,
                height: newHeight,
            };
        }

        return {
            width,
            height,
        };
    }

    public toJsonable(): any {
        const base = super.toJsonable();
        const add: any = {};
        add.image = this.imageObject.url;
        return Support.mergeDeep(base, add);
    }
    public toHistoryObject() {
        const base = super.toHistoryObject();
        base.imageDraw = this.imageDraw;
        return base;
    }
}
