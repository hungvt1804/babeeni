import { Support } from "../helpers/Support";
import { ImageLoader } from "../loader/ImageLoader";
import { BaseLayer } from "./BaseLayer";
import { ImageLayer } from "./ImageLayer";

export class TextLayer extends ImageLayer {
    protected moveable = true;

    protected graphic: any;

    protected textSample: any;
    protected textMaxLength: number;
    protected textAlign: any = ["CENTER", "CENTER"];
    private _textSize: number;
    public get textSize(): number {
        return this._textSize;
    }
    public set textSize(value: number) {
        this._textSize = value;
    }
    private _textUserInput: string;
    public get textUserInput(): string {
        return this._textUserInput;
    }
    public set textUserInput(value: string) {
        this._textUserInput = value;
    }
    protected drawTextSample: boolean = true;
    private _fontDraw: any;
    public get fontDraw(): any {
        return this._fontDraw;
    }
    public set fontDraw(value: any) {
        this._fontDraw = value;
    }
    private _fontColor: any;
    public get fontColor(): any {
        return this._fontColor;
    }
    public set fontColor(value: any) {
        this._fontColor = value;
    }
    private _drawFrameImage: boolean;
    public get drawFrameImage(): boolean {
        return this._drawFrameImage;
    }
    public set drawFrameImage(value: boolean) {
        this._drawFrameImage = value;
    }

    constructor(p5: any, layerConfig: any, positionBase: any) {
        super(p5, layerConfig, positionBase);
        this.textMaxLength = this.layerConfig.text_max_length || 5;
        this.textSample = this.layerConfig.text_sample || "Tech5s";
        this.textSize = this.layerConfig.text_size || 32;
        this.fontColor = [0, 0, 0];
        this.drawFrameImage = this.layerConfig.draw_frame_image || false;
        this.graphic = this.p5.createGraphics(
            BaseLayer.WIDTH,
            BaseLayer.HEIGHT
        );
        this.graphic.imageMode(this.graphic.CORNER);

        if (ImageLoader.hasImage(this.layerName)) {
            this.imageObject = ImageLoader.getImageByName(this.layerName);
            const image = this.imageObject.image;
            this.startPoint = this.getStartPoint(image);
        }
        // this.startPoint = this.getStartPoint(null);
    }
    public applyHistory(layerConfig: any) {
        super.applyHistory(layerConfig);
        this.textMaxLength = layerConfig.text_max_length || 5;
        this.textSample = layerConfig.text_sample || "Tech5s";
        this.textUserInput = layerConfig.textUserInput;
        this.fontDraw = layerConfig.fontDraw;
        this.textSize = layerConfig.textSize;
        this.fontColor = layerConfig.fontColor;
    }
    protected getTextDraw() {
        const text =
            this.textUserInput != null
                ? this.textUserInput
                : this.drawTextSample
                ? this.textSample
                : "";
        return text.substr(0, this.textMaxLength);
    }
    public render() {
        if (this.forbidden) return;
        this.graphic.clear();
        this.graphic.background(0, 0, 0, 0);

        if (this.fontDraw) {
            this.graphic.textFont(this.fontDraw);
        }
        this.graphic.textSize(this.textSize);

        if (this.fontColor) {
            this.graphic.fill(this.fontColor);
        }
        this.graphic.textAlign(
            this.graphic[this.textAlign[0]],
            this.graphic[this.textAlign[1]]
        );
        const positionText = this.getPositionText();
        this.renderFrameImage(positionText);
        this.graphic.text(this.getTextDraw(), positionText.x, positionText.y);

        this.p5.image(this.graphic, this.startPoint.x, this.startPoint.y);
    }
    private renderFrameImage(positionText: any) {
        if (this.drawFrameImage && this.imageObject.image) {
            this.graphic.image(
                this.imageObject.image,
                positionText.x - this.imageObject.image.width / 2,
                positionText.y - this.imageObject.image.height / 2
            );
        }
    }
    private getPositionText() {
        const paddingBottom = this.layerConfig.text_padding_bottom || 0;
        const positionText = this.layerConfig.text_position || [
            "CENTER",
            "BOTTOM",
        ];
        let x = 0;
        let y = 0;
        if (positionText[0] == "CENTER") {
            x = this.imageObject.image.width / 2;
        } else if (positionText[0] == "LEFT") {
            x = this.graphic.textWidth(this.getTextDraw()) / 2;
        } else if (positionText[0] == "RIGHT") {
            x =
                this.imageObject.image.width -
                this.graphic.textWidth(this.getTextDraw()) / 2;
        }
        if (positionText[1] == "CENTER") {
            y = this.imageObject.image.height / 2;
        } else if (positionText[1] == "TOP") {
            y = this.textSize;
        } else if (positionText[1] == "BOTTOM") {
            y = this.imageObject.image.height - this.textSize / 2;
        }
        y -= paddingBottom;
        return {
            x,
            y,
        };
    }
    public toJsonable(): any {
        const base = super.toJsonable();
        const add: any = {};
        add.text_sample = this.textSample;
        add.text_max_length = this.textMaxLength;
        add.text_size = this.textSize;
        add.text_padding_bottom = this.layerConfig.text_padding_bottom || 0;
        add.text_position = this.layerConfig.text_position || [
            "CENTER",
            "BOTTOM",
        ];
        return Support.mergeDeep(base, add);
    }
    public toHistoryObject() {
        const base = super.toHistoryObject();
        base.textUserInput = this.textUserInput;
        base.fontDraw = this.fontDraw;
        base.textSize = this.textSize;
        base.fontColor = this.fontColor;
        return base;
    }
}
