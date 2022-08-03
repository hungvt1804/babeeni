export class ImageLoader {
    private config: any;
    private p5: any;
    private static _IMAGES_POOL: any = {};
    public static get IMAGES_POOL(): any {
        return ImageLoader._IMAGES_POOL;
    }
    public static set IMAGES_POOL(value: any) {
        ImageLoader._IMAGES_POOL = value;
    }

    constructor(p5: any, config: any) {
        this.config = config;
        this.p5 = p5;
        this.parseImage();
        ImageLoader.IMAGES_POOL = {};
    }

    public parseImage() {
        const layers = this.config.layers || {};
        for (let index = 0; index < layers.length; index++) {
            const layer = layers[index];
            const name = layer.name || "base";
            const image = layer.image || "";
            ImageLoader.IMAGES_POOL[name] = { url: image };
        }
    }
    private loadImage(url: any) {
        return new Promise((resolve) => {
            this.p5.loadImage(url, function (img: any) {
                resolve(img);
            });
        });
    }
    public async prepareImage(): Promise<void> {
        for (const [key, value] of Object.entries(ImageLoader.IMAGES_POOL)) {
            const url = (value as any).url;
            const imageObject = await this.loadImage(url);
            ImageLoader.IMAGES_POOL[key] = {
                url: url,
                image: imageObject,
            };
        }
    }

    public static getImageByName(name: string) {
        if (ImageLoader.hasImage(name)) {
            return ImageLoader.IMAGES_POOL[name];
        }
        return null;
    }
    public static hasImage(name: string) {
        return ImageLoader.IMAGES_POOL.hasOwnProperty(name);
    }

    public loadSingleImage(
        url: string,
        callback: any,
        name: string = "",
        addCache: boolean = false
    ) {
        if (name == "") name = url;
        if (!addCache) {
            this.loadImageCallback(url, callback);
        }
        if (addCache) {
            if (!ImageLoader.hasImage(name)) {
                this.loadImageCallback(url, function (imageObject: any) {
                    ImageLoader.IMAGES_POOL[name] = {
                        url: url,
                        image: imageObject,
                    };
                    if (callback) {
                        callback(ImageLoader.IMAGES_POOL[name]);
                    }
                });
            } else {
                if (callback) {
                    callback(ImageLoader.IMAGES_POOL[name]);
                }
            }
        }
    }
    public loadSingleImagePromise(
        url: string,
        name: string = "",
        addCache: boolean = false
    ) {
        if (name == "") name = url;
        return new Promise((resolve) => {
            if (!addCache) {
                this.loadImageCallback(url, function (imageObject: any) {
                    resolve(imageObject);
                });
            }
            if (addCache) {
                if (!ImageLoader.hasImage(name)) {
                    this.loadImageCallback(url, function (imageObject: any) {
                        ImageLoader.IMAGES_POOL[name] = {
                            url: url,
                            image: imageObject,
                        };
                        resolve(ImageLoader.IMAGES_POOL[name]);
                    });
                } else {
                    resolve(ImageLoader.IMAGES_POOL[name]);
                }
            }
        });
    }

    private loadImageCallback(url: string, callback: any) {
        this.p5.loadImage(url, function (image: any) {
            if (callback) {
                callback(image);
            }
        });
    }
}
