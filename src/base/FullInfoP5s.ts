import { InfoHandEmbroidery } from "../classes/InfoHandEmbroidery";
import { InfoTable } from "../classes/InfoTable";
import { Support } from "../helpers/Support";
import { CurrentManager } from "../main";
declare var p5: any;
declare var Tech5sFabric: any;
declare var CURRENT_PRODUCT_MANAGER_V2: any;
declare var EXPORT_IMAGE_V2: any;
declare var currentLang: any;
declare var textLanguage: any;
export class FullInfoP5 {
    public static CACHE_IMAGES: any = {};
    public static TEXT_SIZE = 16;
    public static TR_HEIGHT = 30;
    private p5: any;
    private canvas: any;
    private options: any = {
        addWidth: 240,
        margin: 20,
        widthIcon: 90,
        maxWidthBaseImage: 400,
    };
    private originWidthCanvas = 500;
    private widthCanvas = 500;
    private originHeightCanvas = 500;
    private heightCanvas = 500;
    private margin = 0;
    private _imageBase: any;
    public get imageBase(): any {
        return this._imageBase;
    }
    public set imageBase(value: any) {
        this._imageBase = value;
    }

    private _configAdvanceInfo: any = {};
    public get configAdvanceInfo(): any {
        return this._configAdvanceInfo;
    }
    public set configAdvanceInfo(value: any) {
        this._configAdvanceInfo = value;
    }
    private _isDrawAdvance: boolean = true;
    public get isDrawAdvance(): boolean {
        return this._isDrawAdvance;
    }
    public set isDrawAdvance(value: boolean) {
        this._isDrawAdvance = value;
    }

    constructor(p5: any, options: any) {
        this.p5 = p5;
        this.options = Support.mergeDeep(this.options, options);
        this.margin = this.options.margin;
        this.widthCanvas =
            this.widthCanvas + this.margin + this.options.addWidth;
    }
    public preload() {
        // this.loadImage();
    }
    private loadBaseImage() {
        // var self = this;
        // if (typeof this.imageBase == "string") {
        //     this.p5.loadImage(this.imageBase, function (image: any) {
        //         const size = self._recalcBaseImageSize(image);
        //         self.widthCanvas =
        //             size.width + 2 * self.margin + self.options.addWidth;
        //         self.heightCanvas = size.height + 2 * self.margin;
        //         self.imageBase = image;
        //     });
        // } else {
        //     const size = self._recalcBaseImageSize(this.imageBase);
        //     self.widthCanvas =
        //         size.width + 2 * self.margin + self.options.addWidth;
        //     self.heightCanvas = size.height + 2 * self.margin;
        // }
    }
    // private _recalcBaseImageSize(image: any) {
    //     const width = image.width;
    //     const height = image.height;
    //     const drawWidth =
    //         width > this.options.maxWidthBaseImage
    //             ? this.options.maxWidthBaseImage
    //             : width;
    //     const drawHeight = (height * drawWidth) / width;
    //     this.widthBaseImage = drawWidth;
    //     this.heightBaseImage = drawHeight;
    //     return {
    //         width: drawWidth,
    //         height: drawHeight,
    //     };
    // }
    // private loadImage() {
    //     const self = this;
    //     for (const [key, value] of Object.entries(this.IMAGES)) {
    //         const tmpImage = value as any;

    //         this.p5.loadImage(tmpImage.url, function (image: any) {
    //             self.IMAGES[key]["image"] = image;
    //         });
    //     }
    // }
    public setup() {
        this.canvas = this.p5.createCanvas(this.widthCanvas, this.heightCanvas);
        this.canvas.parent("lol_wrapper");
        this.p5.textAlign(this.p5.LEFT, this.p5.TOP);
        this.p5.frameRate(10);
        // this.p5.noLoop();
    }
    public draw() {
        this.p5.clear();
        this.p5.background(255);

        if (typeof Tech5sFabric != "undefined") {
            this.imageBase = Tech5sFabric.canvas.get();
        }
        if (this.imageBase) {
            this.getSmockImagesConfig();
            const size = this.calculateBaseImageSize();
            this.p5.image(
                this.imageBase,
                this.margin,
                this.margin,
                size.width,
                size.height
            );
            if (this.isDrawAdvance) {
                this._drawAdvance();
            } else {
                this._drawSimple();
            }
        }
    }
    private calculateBaseImageSize() {
        const currentWidth = this.imageBase.width;
        const currentHeight = this.imageBase.height;
        const chieuSoSanh = currentWidth > currentHeight ? "width" : "height";
        let outWidth, outHeight;
        if (chieuSoSanh == "width") {
            outWidth = this.originWidthCanvas;
            outHeight = (currentHeight * outWidth) / currentWidth;
        } else {
            outHeight = this.originHeightCanvas;
            outWidth = (currentWidth * outHeight) / currentHeight;
        }
        return {
            width: outWidth,
            height: outHeight,
        };
    }
    private _drawAdvance() {
        this.p5.textSize(FullInfoP5.TEXT_SIZE);
        this.drawProductInfo();
    }
    private drawProductInfo() {
        const trHeight = FullInfoP5.TR_HEIGHT;
        const tableWidth = this.options.addWidth;
        const topLeftX = this.widthCanvas - this.margin - tableWidth;
        const topLeftY = this.margin;
        let numRow = 1;
        const tableProduct = new InfoTable(
            this.p5,
            topLeftX,
            topLeftY,
            tableWidth,
            trHeight,
            numRow,
            [["ID Product", this.configAdvanceInfo.code || ""]]
        );
        tableProduct.draw();

        const fabrics = this.configAdvanceInfo.fabrics || [];

        var xFabric = topLeftX;
        const yFabric = topLeftY + numRow * trHeight;
        let numRowFabric = fabrics.length;
        if (fabrics.length > 0) {
            const tableFabric = new InfoTable(
                this.p5,
                xFabric,
                yFabric,
                tableWidth,
                trHeight,
                numRowFabric,
                fabrics
                // [
                //     ["Fabric", "12345"],
                //     ["Fabric", "12345"],
                //     ["Fabric", "12345"],
                //     ["Fabric", "12345"],
                // ]
            );
            tableFabric.colSpan = true;
            tableFabric.draw();
        }

        const trims = this.configAdvanceInfo.trims || [];
        const xTrim = topLeftX;
        const yTrim = yFabric + numRowFabric * trHeight;
        const numRowTrim = trims.length;
        if (trims.length > 0) {
            const tableTrim = new InfoTable(
                this.p5,
                xTrim,
                yTrim,
                tableWidth,
                trHeight,
                numRowTrim,
                trims
                // [["Trim", "Z1,Z2"]]
            );
            tableTrim.draw();
        }

        const smock = this.configAdvanceInfo.smock || {};
        const smockImages = smock.images || {};
        if (Object.keys(smockImages).length > 0) {
            const xSmock = topLeftX;
            const countSpaceBetweenBlock = 1;
            const ySmock =
                yTrim +
                numRowTrim * trHeight +
                trHeight * countSpaceBetweenBlock;
            this.p5.rect(xSmock, ySmock, tableWidth, 115);
            this.p5.text(
                this.getKeyLanguage("smock_pattern", "Smock Pattern"),
                topLeftX + 5,
                ySmock + 10
            );

            const widthRect = this.options.widthIcon * 0.8;
            const heightRect = this.options.widthIcon * 0.8;
            const imageStartX = xSmock;
            const spaceAfterTitle = trHeight * 1.1;
            const imageStartY = ySmock + spaceAfterTitle;
            const imagePadding = 5;
            let count = 0;
            for (const [key, image] of Object.entries(smockImages)) {
                const currentImage = (image as any).image;

                const imageWidth = currentImage.width;

                let xImage =
                    imageStartX +
                    count * widthRect +
                    (count + 1) * imagePadding;
                let yImage = imageStartY;
                this.p5.rect(xImage, yImage, widthRect, heightRect);

                const maxWidthImage = widthRect - imagePadding * 2;
                const maxHeightImage = heightRect - imagePadding * 2;
                const size = this.getSizeImage(
                    currentImage,
                    maxWidthImage,
                    maxHeightImage
                );
                this.p5.image(
                    currentImage,
                    xImage + imagePadding,
                    yImage + imagePadding,
                    size.width,
                    size.height
                );
                count++;
            }
        }
    }

    private getSizeImage(image: any, maxWidth: number, maxHeight: number) {
        const currentWidth = image.width;
        const currentHeight = image.height;
        const chieuSoSanh = currentWidth > currentHeight ? "width" : "height";
        let outWidth, outHeight;
        if (chieuSoSanh == "width") {
            outWidth = maxWidth;
            outHeight = (currentHeight * outWidth) / currentWidth;
        } else {
            outHeight = maxHeight;
            outWidth = (currentWidth * outHeight) / currentHeight;
        }
        return {
            width: outWidth,
            height: outHeight,
        };
    }
    private _drawSimple() {
        const smock = this.configAdvanceInfo.smock || {};
        const smockImages = smock.images || {};
        const widthicon = this.options.widthIcon;
        const xRect =
            this.widthCanvas - this.margin - this.options.widthIcon - widthicon;
        const yRect = this.margin;

        const padding = 10;

        const handEmbroi = new InfoHandEmbroidery(
            this.p5,
            smockImages,
            xRect,
            yRect,
            widthicon,
            padding
        );
        handEmbroi.draw();
    }
    private getSmockImagesConfig() {
        var productInfo = CurrentManager.CURRENT_PRODUCT;
        var smock = productInfo.smock || {};
        var images = smock.data || [];
        Promise.all(
            images.map((image: any) => {
                return this.promiseLoadP5Image(image.image_preview);
            })
        ).then((results) => {
            let configAdvanceInfo: any = {
                code: EXPORT_IMAGE_V2.PRODUCT_DESIGNED_SAVED_CODE,
                smock: {
                    images: {},
                },
                trims: this.getTrimConfig(),
                fabrics: this.getFabricConfig(),
            };

            for (var i = 0; i < results.length; i++) {
                var image = results[i];
                var name = "image" + i;
                configAdvanceInfo.smock.images[name] = {
                    name,
                    image,
                };
            }
            this.configAdvanceInfo = configAdvanceInfo;
        });
    }
    private promiseLoadP5Image(imageUrl: any) {
        return new Promise((resolve) => {
            if (FullInfoP5.CACHE_IMAGES[imageUrl]) {
                resolve(FullInfoP5.CACHE_IMAGES[imageUrl]);
            } else {
                this.p5.loadImage(imageUrl, function (image: any) {
                    FullInfoP5.CACHE_IMAGES[imageUrl] = image;
                    resolve(image);
                });
            }
        });
    }
    private getTrimConfig() {
        var productInfo = CurrentManager.CURRENT_PRODUCT;
        var trims = productInfo.trims || [];
        var trimcolors = [];
        for (var i = 0; i < trims.length; i++) {
            var trim = trims[i];
            trimcolors.push(trim.nameColor);
        }
        trimcolors = trimcolors.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });
        if (trimcolors.length > 0) {
            return [
                [this.getKeyLanguage("trim", "Trim"), trimcolors.join(", ")],
            ];
        }
        return [];
    }
    private getFabricConfig() {
        var productInfo = CurrentManager.CURRENT_PRODUCT;
        var fabrics = productInfo.fabrics || [];
        var fabricPrints: any = {};
        for (var i = 0; i < fabrics.length; i++) {
            var fabric = fabrics[i];
            var layerName = fabric.layerName;
            var resultPrint = this.getGroupPrintByName(layerName);
            if (resultPrint != "") {
                fabricPrints[resultPrint] = fabric.nameFabric;
            }
        }
        var finalFabrics = [];
        var fabricPrintsKeys = Object.keys(fabricPrints);
        fabricPrintsKeys.sort((a, b) => a.localeCompare(b));
        for (var i = 0; i < fabricPrintsKeys.length; i++) {
            var key = fabricPrintsKeys[i];
            var value = fabricPrints[key];
            finalFabrics.push([
                this.getKeyLanguage("fabric", "Fabric"),
                `${key}: ${value}`,
            ]);
        }
        return finalFabrics;
    }
    private getGroupPrintByName(name: any) {
        var configGroup = CURRENT_PRODUCT_MANAGER_V2.currentConfig;
        for (var i = 0; i < configGroup.length; i++) {
            var group = configGroup[i];
            if (group.key == name) {
                return group.position_print;
            }
        }
        return "";
    }
    private getKeyLanguage(key: string, def: string) {
        const json = JSON.parse(textLanguage);
        if (json[key]) {
            return json[key][currentLang];
        }
        return def;
    }
    public static make(options: {}) {
        var p5Canvas = function (p5: any) {
            var info = ((window as any).Tech5sBabeeInfo = new FullInfoP5(
                p5,
                options
            ));
            p5.preload = () => {
                info.preload();
            };
            p5.setup = () => {
                info.setup();
            };
            p5.draw = () => {
                info.draw();
            };
        };
        return new p5(p5Canvas);
    }
}
