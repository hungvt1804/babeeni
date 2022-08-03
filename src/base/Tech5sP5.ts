import { HistoryManger } from "../classes/HistoryManager";
import { P5Helper } from "../helpers/P5Helper";
import { Support } from "../helpers/Support";
import { BaseLayer } from "../layers/BaseLayer";
import { ConfigLoader } from "../loader/ConfigLoader";
import { FontLoader } from "../loader/FontLoader";
import { ImageLoader } from "../loader/ImageLoader";
import { LayerLoader } from "../loader/LayerLoader";
import BaseP5 from "./BaseP5";

class Tech5sP5 extends BaseP5 {
    private configLoader;
    private _imageLoader: ImageLoader;
    public get imageLoader(): ImageLoader {
        return this._imageLoader;
    }
    public set imageLoader(value: ImageLoader) {
        this._imageLoader = value;
    }
    private _layerLoader: LayerLoader;
    public get layerLoader(): LayerLoader {
        return this._layerLoader;
    }
    public set layerLoader(value: LayerLoader) {
        this._layerLoader = value;
    }
    private _fontLoader: FontLoader;
    public get fontLoader(): FontLoader {
        return this._fontLoader;
    }
    public set fontLoader(value: FontLoader) {
        this._fontLoader = value;
    }
    private _historyManager: HistoryManger;
    public get historyManager(): HistoryManger {
        return this._historyManager;
    }
    public set historyManager(value: HistoryManger) {
        this._historyManager = value;
    }

    private loaded: boolean = false;

    private canvas: any;

    private _dontPushHistory: boolean = false;
    public get dontPushHistory(): boolean {
        return this._dontPushHistory;
    }
    public set dontPushHistory(value: boolean) {
        this._dontPushHistory = value;
    }

    private options: any = {
        width: 800,
        height: 800,
        wrapper: "canvas_wrapper",
        loop: false,
        rate: 20,
        background: 255,
        moveable: false,
    };
    constructor(p5: any, config: string, options: object = {}) {
        super(p5);
        this.options = Support.mergeDeep(this.options, options);
        this.configLoader = new ConfigLoader(config);
        this.historyManager = new HistoryManger();
    }
    async load(): Promise<void> {
        await this.configLoader.load();
        const config = this.configLoader.config;
        this.imageLoader = new ImageLoader(this.p5, config);
        this.imageLoader.parseImage();
        await this.imageLoader.prepareImage();
        this.layerLoader = new LayerLoader(this.p5, config);
        this.layerLoader.load();
        P5Helper.init(this.p5, this.options);
        this.fontLoader = new FontLoader(this.p5, config);
        P5Helper.setDirty(true);
        this.loaded = true;
    }

    async preload(): Promise<void> {
        await this.load();
    }
    public save() {
        this.p5.save(this.canvas, "image.png");
    }
    public setup(): void {
        this.canvas = this.p5.createCanvas(
            this.options.width,
            this.options.height
        );
        if (this.options.wrapper) {
            this.canvas.parent(this.options.wrapper);
        }
        P5Helper.clear(this.p5);
        this.p5.frameRate(this.options.rate);
        if (!this.options.loop) {
            this.p5.noLoop();
        }
    }
    public frameCount() {
        return this.p5.frameCount;
    }
    public draw(): void {
        if (P5Helper.needDraw() || this.options.moveable) {
            const layers = LayerLoader.LAYERS;
            P5Helper.clear(this.p5);
            for (const [key, layer] of Object.entries(layers)) {
                (layer as BaseLayer).render();
                (layer as BaseLayer).toHistoryObject();
            }

            if (this._acceptPushHistory()) {
                this.historyManager.push(P5Helper.getHistoryObject());
            }
            if (P5Helper.isApplyHistory() && !this.options.moveable) {
                P5Helper.setApplyHistory(false);
            }

            P5Helper.setDirty(false);
        }
    }
    private _acceptPushHistory(): boolean {
        return (
            this.loaded && !P5Helper.isApplyHistory() && !this.dontPushHistory
        );
    }
    public keyPressed(e: any) {
        if (e.keyCode == 90 && (e.ctrlKey || e.metaKey)) {
            this.historyManager.babeePrev();
        } else if (e.keyCode == 89 && (e.ctrlKey || e.metaKey)) {
            this.historyManager.babeeNext();
        }
    }
    saveToBase64() {
        return this.canvas.canvas.toDataURL();
    }
    saveToFile() {
        const name = this.configLoader.config.name || "Tech5s";
        this.p5.saveCanvas(name, "jpg");
    }
    remove() {
        this.p5.remove();
    }
    redraw(num: number = 3): void {
        this.p5.redraw(num);
    }
}
export default Tech5sP5;
