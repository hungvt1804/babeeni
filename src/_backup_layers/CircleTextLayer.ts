import { Support } from "../helpers/Support";
import { ImageLoader } from "../loader/ImageLoader";
import { BaseLayer } from "./BaseLayer";
import { TextLayer } from "./TextLayer";

export class CircleTextLayer extends TextLayer {
    private drawCircleCompare: boolean = false;
    private radiusCircle: any;
    constructor(p5: any, layerConfig: any, positionBase: any) {
        super(p5, layerConfig, positionBase);
        this.radiusCircle = this.layerConfig.radius_circle || 100;
        this.graphic.imageMode(this.graphic.CENTER);
        if (ImageLoader.hasImage(this.layerName)) {
            this.imageObject = ImageLoader.getImageByName(this.layerName);
            const image = this.imageObject.image;
            this.startPoint = this.getStartPoint(image);
        }
    }
    public applyHistory(layerConfig: any) {
        super.applyHistory(layerConfig);
        this.radiusCircle = layerConfig.radius_circle || 100;
    }
    private printed = false;
    public render() {
        if (this.forbidden) return;
        this.graphic.clear();
        this.graphic.background(0, 0, 0, 0);
        if (this.fontDraw) {
            this.graphic.textFont(this.fontDraw);
        }
        this.graphic.textSize(this.textSize);

        const message = this.getTextDraw();
        const radiusCirle = this.radiusCircle;

        // this.graphic.textFont(font);
        this.graphic.resetMatrix();
        this.graphic.translate(BaseLayer.WIDTH / 2, BaseLayer.HEIGHT / 2);
        this.drawCircle(radiusCirle);
        var arclength = 0;
        const fullWithText = this.getLengthText(message);
        const addCirle = fullWithText / radiusCirle;

        for (var i = 0; i < message.length; i++) {
            var currentChar = message.charAt(i);
            var w = this.graphic.textWidth(currentChar);
            arclength += w / 2;
            var theta =
                this.graphic.PI / 2 - addCirle / 2 + arclength / radiusCirle;
            this.graphic.push();
            this.graphic.translate(
                -radiusCirle * this.graphic.cos(theta),
                radiusCirle * this.graphic.sin(theta) - 10
            );
            if (!this.printed) {
                this.printed = true;
            }
            this.graphic.rotate(this.graphic.PI / 2 - theta);
            if (this.fontColor) {
                this.graphic.fill(
                    this.fontColor[0],
                    this.fontColor[1],
                    this.fontColor[2]
                );
            }
            this.graphic.text(currentChar, 0, 0);
            this.graphic.pop();
            arclength += w;
        }

        this.p5.image(this.graphic, 0, this.getDistanceCircleToRoot());
    }

    private getLengthText(message: string) {
        let fullWidth = 0;
        for (var i = 0; i < message.length; i++) {
            var currentChar = message.charAt(i);
            var w = this.graphic.textWidth(currentChar);
            fullWidth += w + w / 2;
        }
        fullWidth -= 5;
        return fullWidth;
    }
    private drawCircle(radiusCirle: number) {
        if (!this.drawCircleCompare) return;
        //Vẽ hình tròn để đo khung text
        this.graphic.noFill();
        this.graphic.stroke(255);
        this.graphic.strokeWeight(3);
        this.graphic.fill(0, 0, 0);
        this.graphic.ellipse(0, 0, radiusCirle * 2, radiusCirle * 2);
    }
    private getDistanceCircleToRoot() {
        const heightFrame = this.imageObject.image.height;
        const heightCenterToText = this.radiusCircle / 2;
        const imageBase = ImageLoader.getImageByName("base");
        let haftHeightBase = 0;
        if (imageBase) {
            haftHeightBase = imageBase.image.height / 2;
        }
        let distance = 0;
        if (haftHeightBase > 0) {
            // distance =
            //     haftHeightBase -
            //     heightFrame +
            //     heightCenterToText +
            //     this.getDistanceYFrame();
            distance =
                -haftHeightBase +
                this.getDistanceYFrame() +
                heightFrame -
                heightCenterToText * 2;
        }
        return distance;
    }
    private getDistanceYFrame() {
        const point = this.layerConfig.point || { x: 0, y: 0 };
        const textPaddingBottom = this.layerConfig.text_padding_bottom || 0;
        return point.y + textPaddingBottom;
    }
    public toJsonable(): any {
        const base = super.toJsonable();
        const add: any = {};
        add.radius_circle = this.radiusCircle;
        return Support.mergeDeep(base, add);
    }
    public toHistoryObject() {
        return super.toHistoryObject();
    }
}
