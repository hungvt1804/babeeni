import { Support } from "../helpers/Support";
declare var p5: any;
export class InfoP5 {
    private p5: any;
    private canvas: any;
    private imageBase: any;
    private options: any = {
        addWidth: 150,
        margin: 20,
    };
    private widthCanvas = 0;
    private heightCanvas = 0;
    private margin = 0;
    private IMAGES: any = {
        img: {
            name: "img",
            url: "https://picsum.photos/200",
        },

        img2: {
            name: "img2",
            url: "https://picsum.photos/200",
        },
        img3: {
            name: "img3",
            url: "https://picsum.photos/200",
        },
    };
    constructor(p5: any, imageBase: any, options: any) {
        this.p5 = p5;
        this.options = Support.mergeDeep(this.options, options);
        this.imageBase = imageBase;
        this.margin = this.options.margin;
        this.widthCanvas =
            this.imageBase.width + 2 * this.margin + this.options.addWidth;
        this.heightCanvas = this.imageBase.height + 2 * this.margin;
    }
    public preload() {
        this.loadImage();
    }
    private loadImage() {
        const self = this;
        for (const [key, value] of Object.entries(this.IMAGES)) {
            const tmpImage = value as any;

            this.p5.loadImage(tmpImage.url, function (image: any) {
                self.IMAGES[key]["image"] = image;
            });
        }
    }
    public setup() {
        this.canvas = this.p5.createCanvas(this.widthCanvas, this.heightCanvas);
    }
    public draw() {
        this.p5.image(this.imageBase, this.margin, this.margin);
        this.drawHandEmbroidery();
    }
    private drawHandEmbroidery() {
        const padding = 10;
        const widthItem = 100;
        const heightRect = 100;
        const x = this.widthCanvas - widthItem - 2 * padding - this.margin;
        const y = this.margin;
        const numberImage = 3;

        this.p5.push();
        this.p5.fill("#d2d2d2");
        this.p5.noStroke();
        this.p5.rect(
            x,
            y,
            widthItem + 2 * padding,
            heightRect * numberImage + (numberImage + 1) * padding,
            5
        );

        let count = 0;
        const startImageX = x + padding;
        const startImageY = y + padding;
        for (const [key, value] of Object.entries(this.IMAGES)) {
            const tmpImage = value as any;
            if (tmpImage.image) {
                this.p5.image(
                    tmpImage.image,
                    startImageX,
                    startImageY + count * (heightRect + padding),
                    widthItem,
                    heightRect
                );
            }

            count++;
        }

        this.p5.pop();
    }

    public static make(imageBase: any, options: {}) {
        var p5Canvas = function (p5: any) {
            var info = new InfoP5(p5, imageBase, options);
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
