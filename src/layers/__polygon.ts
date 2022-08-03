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
    private graphicSecond: any;
    constructor(p5: any, layerConfig: any, positionBase: any) {
        super(p5, layerConfig, positionBase);
        this.shape = this.p5.createGraphics(BaseLayer.WIDTH, BaseLayer.HEIGHT);

        this.graphicSecond = this.p5.createGraphics(
            BaseLayer.WIDTH,
            BaseLayer.HEIGHT
        );
        this.graphicSecond.imageMode(this.graphicSecond.CENTER);

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
        // this.p5.background(0);

        this.graphic.clear();
        this.graphic.background(0);
        this.graphicSecond.clear();
        this.graphicSecond.background(0, 0, 0, 100);
        if (ImageLoader.hasImage(this.layerName)) {
            this.imageObject = ImageLoader.getImageByName(this.layerName);
            const image = this.imageObject.image;
            if (image) {
                let renderImage = image;
                this.renderShape();

                let sx = this.startPoint.x;
                let sy = this.startPoint.y;
                if (this.isMoveable()) {
                    this.move();
                    sx += this.moveOffsetX;
                    sy += this.moveOffsetY;
                }
                // this.renderRotateImage(renderImage, sx, sy);

                renderImage = this.renderFabric(image);

                // this.hello(renderImage);

                // this.p5.image(this.shape, sx - 20, sy - 20);
                // this.p5.image(renderImage, sx, sy);
                if (this.fabric) {
                    var ximage = this.p5.createImage(
                        this.shape.width,
                        this.shape.height
                    );
                    ximage.copy(
                        this.fabric,
                        0,
                        0,
                        this.fabric.width,
                        this.fabric.height,
                        0,
                        0,
                        this.fabric.width,
                        this.fabric.height
                    );
                    this.graphicSecond
                        .resetMatrix()
                        .translate(BaseLayer.WIDTH / 2, BaseLayer.HEIGHT / 2)
                        .rotate(0);
                    this.graphicSecond.image(renderImage, 400, 400);
                }

                if (this.layerName == "khung_text_duoi") {
                    console.log(((window as any).xxx = this.graphicSecond));
                }

                // this.p5.image(this.shapeNoFilled, sx, sy);

                this.p5.image(this.graphicSecond, 10, 10);
            }
        }
    }
    protected hello(renderImage: any) {
        // var newImg = this.p5.createImage(this.shape.width, this.shape.height);
        // newImg.copy(
        //     renderImage,
        //     0,
        //     0,
        //     renderImage.width,
        //     renderImage.height,
        //     0,
        //     0,
        //     renderImage.width,
        //     renderImage.height
        // );
        this.graphicSecond.image(renderImage, 100, 100);
        // this.p5.image(this.graphicSecond, 0, 0);
    }
    protected renderRotateImage(renderImage: any, sx: any, sy: any) {
        const drawSize = this.getWidthHeightDraw(renderImage);
        this.rotateImage(this.graphicSecond, 80, renderImage, drawSize);
        const imageWidth = renderImage.width;
        const imageHeight = renderImage.height;
        this.p5.image(
            this.graphicSecond,
            -BaseLayer.WIDTH / 2 + sx + imageWidth / 2,
            -BaseLayer.HEIGHT / 2 + sy + imageHeight / 2
        );
    }
    protected renderShape() {
        const points = this.convertToStandardArray(this.listPoints);
        for (let polyIndex = 0; polyIndex < points.length; polyIndex++) {
            const pointObject = points[polyIndex];
            const poly = pointObject.data;
            const filled = pointObject.filled;
            if (filled) {
                // translate (width/2, height/2);
                // this.shape
                //     .resetMatrix()
                //     .translate(BaseLayer.WIDTH / 2, BaseLayer.HEIGHT / 2)
                //     .rotate(this.shape.PI / 3);
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
    protected renderFabric(image: any) {
        const imgW = image.width;
        const imgH = image.height;
        let renderImage = image;
        if (this.fabric) {
            let newImg = this.renderAngleFabric(image);
            this.graphicSecond.image(newImg, 0, 0);
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

    protected renderAngleFabric(destImage: any) {
        var cloneImage = this.p5.createImage(
            this.shape.width,
            this.shape.height
        );
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
