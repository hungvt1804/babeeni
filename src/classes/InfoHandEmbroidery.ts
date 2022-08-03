export class InfoHandEmbroidery {
    private images: any;
    private heightIcon: number;
    private widthIcon: number;
    private padding: number;
    private doublePadding: number;
    private startX: number;
    private startY: number;
    private p5: any;
    constructor(
        p5: any,
        images: any,
        startX: number,
        startY: number,
        heightIcon: number = 100,
        padding: number = 10
    ) {
        this.p5 = p5;
        this.startX = startX;
        this.startY = startY;
        this.images = images;
        this.heightIcon = heightIcon;
        this.padding = padding;
        this.doublePadding = 2 * padding;
        this.widthIcon = this.heightIcon;
    }
    draw() {
        this.drawRect();
        this.drawimage();
    }
    private drawRect() {
        const heightOfImages = this.calTotalHeightImage();
        const countImage = Object.entries(this.images).length;

        const countImageDraw = countImage > 0 ? countImage + 1 : 0;
        const heightRect = heightOfImages + countImageDraw * this.padding;

        const widthRect = this.widthIcon + this.doublePadding;

        this.p5.rect(this.startX, this.startY, widthRect, heightRect, 5);
        // this.p5.fill("#ececec");
        this.p5.noStroke();
    }
    private drawimage() {
        let count = 0;

        for (const [key, image] of Object.entries(this.images)) {
            const currentImage = (image as any).image;
            const size = this.getSizeImage(currentImage);

            const addX = (this.widthIcon - size.width) / 2;
            let xImage = this.startX + this.padding + addX;
            let yImage =
                this.startY + count * size.height + (count + 1) * this.padding;

            this.p5.image(
                currentImage,
                xImage,
                yImage,
                size.width,
                size.height
            );
            count++;
        }
    }
    private getSizeImage(image: any) {
        const currentWidth = image.width;
        const currentHeight = image.height;
        const chieuSoSanh = currentWidth > currentHeight ? "width" : "height";
        let outWidth, outHeight;
        if (chieuSoSanh == "width") {
            outWidth = this.widthIcon;
            outHeight = (currentHeight * outWidth) / currentWidth;
        } else {
            outHeight = this.heightIcon;
            outWidth = (currentWidth * outHeight) / currentHeight;
        }
        return {
            width: outWidth,
            height: outHeight,
        };
    }
    private calTotalHeightImage() {
        let totalHeightImage = 0;
        totalHeightImage = Object.entries(this.images).length * this.heightIcon;
        return totalHeightImage;
    }
}
