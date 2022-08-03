import { P5Helper } from "../helpers/P5Helper";
import { Support } from "../helpers/Support";
import { ImageLoader } from "../loader/ImageLoader";
import { BaseLayer } from "./BaseLayer";
import { ImageLayer } from "./ImageLayer";

export class TrimLayer extends ImageLayer {
    protected shape: any;
    protected shapeNoFilled: any;
    protected listPoints: any = [];
    private _colorFill: any;
    public get colorFill(): any {
        return this._colorFill;
    }
    public set colorFill(value: any) {
        this._colorFill = value;
    }
    constructor(p5: any, layerConfig: any, positionBase: any) {
        super(p5, layerConfig, positionBase);
        this.shape = this.p5.createGraphics(BaseLayer.WIDTH, BaseLayer.HEIGHT);
        this.shapeNoFilled = this.p5.createGraphics(
            BaseLayer.WIDTH,
            BaseLayer.HEIGHT
        );
        this.listPoints = layerConfig.coords || [];

        this.graphic.imageMode(this.graphic.CENTER);

        const image = this.imageObject.image;
        this.startPoint = this.getStartPoint(image);
    }

    public applyHistory(layerConfig: any) {
        super.applyHistory(layerConfig);
        this.listPoints = layerConfig.coords || [];
        if (layerConfig.colorFill) {
            this.colorFill = layerConfig.colorFill;
        }
    }

    protected convertToStandardArray(points: any) {
        return points;
    }
    public render() {
        if (this.forbidden) return;
        this.graphic.clear();
        this.graphic.background(0);
        if (ImageLoader.hasImage(this.layerName)) {
            this.imageObject = ImageLoader.getImageByName(this.layerName);
            const image = this.imageObject.image;
            if (image) {
                let renderImage = image;
                this.renderShape();
                renderImage = this.renderFabric(image);
                let sx = this.startPoint.x;
                let sy = this.startPoint.y;
                if (this.isMoveable()) {
                    this.move();
                    sx += this.moveOffsetX;
                    sy += this.moveOffsetY;
                }
                // this.p5.image(this.shape, 0, 0);
                this.p5.image(renderImage, sx, sy);
                // this.p5.image(this.shapeNoFilled, sx, sy);
            }
        }
    }
    protected renderFabric(image: any) {
        const angle = this.layerConfig.angle || 0;
        const imgW = image.width;
        const imgH = image.height;
        let renderImage = image;
        if (this.colorFill) {
            var newImg = this.p5.createImage(
                this.shape.width,
                this.shape.height
            );
            newImg = this.renderAngle(newImg, image);

            newImg.mask(this.shape);
            newImg.blend(
                image,
                0,
                0,
                imgW,
                imgH,
                0,
                0,
                imgW,
                imgH,
                this.p5.MULTIPLY
            );
            renderImage = newImg;
        }
        return renderImage;
    }
    protected renderShape() {
        const points = this.convertToStandardArray(this.listPoints);
        for (let polyIndex = 0; polyIndex < points.length; polyIndex++) {
            const pointObject = points[polyIndex];
            const poly = pointObject.data;
            const filled = pointObject.filled;
            if (filled) {
                this.shape.beginShape();
                for (let index = 0; index < poly.length; index++) {
                    const point = poly[index];
                    this.shape.curveVertex(point.x, point.y);
                    this.shape.noStroke();
                }
                this.shape.endShape(this.p5.CLOSE);
            } else {
                this.shapeNoFilled.beginShape();
                for (let index = 0; index < poly.length; index++) {
                    const point = poly[index];
                    this.shapeNoFilled.curveVertex(point.x, point.y);
                    this.shapeNoFilled.noStroke();
                }
                this.shapeNoFilled.endShape(this.p5.CLOSE);
                this.shapeNoFilled.fill(255);
            }
        }
    }
    protected renderAngle(cloneImage: any, destImage: any) {
        this.graphic.fill(this.colorFill);
        this.graphic.rect(0, 0, this.graphic.width, this.graphic.height);
        cloneImage.copy(
            this.graphic,
            0,
            0,
            destImage.width,
            destImage.height,
            0,
            0,
            destImage.width,
            destImage.height
        );
        return cloneImage;
    }
    public toJsonable(): any {
        const base = super.toJsonable();
        const coords = this.layerConfig.coords || "";
        const add: any = {};
        if (coords != "") {
            add.coords = coords;
        }
        return Support.mergeDeep(base, add);
    }
    public toHistoryObject() {
        const base = super.toHistoryObject();
        base.colorFill = this.colorFill;
        return base;
    }
}
