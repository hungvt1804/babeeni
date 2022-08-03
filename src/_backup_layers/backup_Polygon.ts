import { P5Helper } from "../helpers/P5Helper";
import { Support } from "../helpers/Support";
import { ImageLoader } from "../loader/ImageLoader";
import { BaseLayer } from "./BaseLayer";
import { ImageLayer } from "./ImageLayer";

export class PolygonLayer extends ImageLayer {
    protected shape: any;
    protected shapeNoFilled: any;
    protected listPoints: any = [];
    protected _fabric: any;
    public get fabric(): any {
        return this._fabric;
    }
    public set fabric(value: any) {
        this._fabric = value;
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
        if (layerConfig.fabric) {
            this.fabric = layerConfig.fabric;
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
                    // P5Helper.clear(this.p5);
                }
                this.p5.image(this.shape, sx, sy);
                this.p5.image(renderImage, sx, sy);
                this.p5.image(this.shapeNoFilled, sx, sy);
            }
        }
    }
    protected renderFabric(image: any) {
        const angle = this.layerConfig.angle || 0;
        const imgW = image.width;
        const imgH = image.height;
        let renderImage = image;
        if (this.fabric) {
            var newImg = this.p5.createImage(
                this.shape.width,
                this.shape.height
            );
            newImg = this.renderAngle(newImg, image);
            // if (angle > 0) {
            //     newImg = this.renderAngle(newImg, image);
            // } else {
            //     newImg.copy(this.fabric, 0, 0, imgW, imgH, 0, 0, imgW, imgH);
            // }
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
        let angle = this.layerConfig.angle || 0;
        const scale = 0.25;
        angle = (angle * this.p5.PI) / 180;
        const fabricWidth = this.fabric.width;
        const fabricHeight = this.fabric.height;
        const widthAfterScale = scale * fabricWidth;
        const heightAfterScale = (widthAfterScale * fabricHeight) / fabricWidth;

        const maxxRepeatX = Math.floor(
            (BaseLayer.WIDTH * 1.5) / widthAfterScale
        );
        const maxxRepeatY = Math.floor(
            (BaseLayer.HEIGHT * 1.5) / heightAfterScale
        );
        // Lặp ảnh để full graphic

        this.graphic.push();
        this.graphic
            .resetMatrix()
            .translate(BaseLayer.WIDTH / 2, BaseLayer.HEIGHT / 2)
            .rotate(angle);

        for (let counti = 0; counti < maxxRepeatX / 2; counti++) {
            for (let countj = 0; countj < maxxRepeatY / 2; countj++) {
                this.graphic.image(
                    this.fabric,
                    counti * widthAfterScale,
                    countj * heightAfterScale,
                    widthAfterScale,
                    heightAfterScale
                );
                this.graphic.image(
                    this.fabric,
                    -counti * widthAfterScale,
                    -countj * heightAfterScale,
                    widthAfterScale,
                    heightAfterScale
                );
                this.graphic.image(
                    this.fabric,
                    -counti * widthAfterScale,
                    countj * heightAfterScale,
                    widthAfterScale,
                    heightAfterScale
                );
                this.graphic.image(
                    this.fabric,
                    counti * widthAfterScale,
                    -countj * heightAfterScale,
                    widthAfterScale,
                    heightAfterScale
                );
            }
        }
        this.graphic.pop();

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
        base.fabric = this.fabric;
        return base;
    }
}
