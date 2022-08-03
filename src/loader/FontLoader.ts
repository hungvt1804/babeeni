export class FontLoader {
    private config: any;
    private p5: any;
    private static _FONTS_POOL: any = {};
    public static get FONTS_POOL(): any {
        return FontLoader._FONTS_POOL;
    }
    public static set FONTS_POOL(value: any) {
        FontLoader._FONTS_POOL = value;
    }

    constructor(p5: any, config: any) {
        this.config = config;
        this.p5 = p5;
        FontLoader.FONTS_POOL = {};
    }

    public static getFontByName(name: string) {
        if (FontLoader.hasFont(name)) {
            return FontLoader.FONTS_POOL[name];
        }
        return null;
    }
    public static hasFont(name: string) {
        return FontLoader.FONTS_POOL.hasOwnProperty(name);
    }
    public loadSingleFontPromise(
        url: string,
        name: string = "",
        addCache: boolean = false
    ) {
        if (name == "") name = url;
        return new Promise((resolve) => {
            if (!addCache) {
                this.loadFont(url, function (font: any) {
                    resolve(font);
                });
            }
            if (addCache) {
                if (!FontLoader.hasFont(name)) {
                    this.loadFont(url, function (font: any) {
                        FontLoader.FONTS_POOL[name] = {
                            url: url,
                            font: font,
                        };
                        resolve(FontLoader.FONTS_POOL[name]);
                    });
                } else {
                    resolve(FontLoader.FONTS_POOL[name]);
                }
            }
        });
    }
    public loadSingleFont(
        url: string,
        callback: any,
        name: string = "",
        addCache: boolean = false
    ) {
        if (name == "") name = url;
        if (!addCache) {
            this.loadFont(url, callback);
        }
        if (addCache) {
            if (!FontLoader.hasFont(name)) {
                this.loadFont(url, function (font: any) {
                    FontLoader.FONTS_POOL[name] = {
                        url: url,
                        font: font,
                    };
                    if (callback) {
                        callback(FontLoader.FONTS_POOL[name]);
                    }
                });
            } else {
                if (callback) {
                    callback(FontLoader.FONTS_POOL[name]);
                }
            }
        }
    }
    private loadFont(url: string, callback: any) {
        this.p5.loadFont(url, function (font: any) {
            if (callback) {
                callback(font);
            }
        });
    }
}
