import { Support } from "../helpers/Support";
import { BaseLayer } from "../layers/BaseLayer";
import { GroupLayer } from "../layers/GroupLayer";
import { LayerProvider } from "../layers/LayerProvider";

export class LayerLoader {
    private p5: any;
    private layerConfigs: any;
    private static _LAYERS: any = {};
    public static get LAYERS(): any {
        return LayerLoader._LAYERS;
    }
    public static set LAYERS(value: any) {
        LayerLoader._LAYERS = value;
    }
    private static _CURRENT_LAYER_MOVEABLE: any = 0;
    public static get CURRENT_LAYER_MOVEABLE(): any {
        return LayerLoader._CURRENT_LAYER_MOVEABLE;
    }
    public static set CURRENT_LAYER_MOVEABLE(value: any) {
        LayerLoader._CURRENT_LAYER_MOVEABLE = value;
    }
    constructor(p5: any, config: any) {
        this.p5 = p5;
        this.layerConfigs = config.layers || [];
        LayerLoader.LAYERS = {};
    }

    public static hasLayer(name: string) {
        return LayerLoader.LAYERS.hasOwnProperty(name);
    }
    private getLayer(name: string) {
        console.error(
            "Để đảm bảo hoạt động của HistoryManager hãy sử dụng hàm getLayerByNameOrGroup thay vì getLayer"
        );
        return;
        if (LayerLoader.hasLayer(name)) {
            return LayerLoader.LAYERS[name];
        }
    }
    public getLayerByGroup(groupName: string) {
        const results: any = {};
        for (const [key, value] of Object.entries(LayerLoader.LAYERS)) {
            const group = (value as any).groupName || "";
            if (group == groupName) {
                results[key] = value;
            }
        }
        return new GroupLayer(results);
    }
    public getLayerByNameOrGroup(layerNameOrGroupName: string) {
        const results: any = {};
        for (const [key, value] of Object.entries(LayerLoader.LAYERS)) {
            const group = (value as any).groupName || "";
            if (group == layerNameOrGroupName || key == layerNameOrGroupName) {
                results[key] = value;
            }
        }
        return new GroupLayer(results);
    }
    public load(): void {
        var hasBasePoint: boolean = false;
        var basePoint: any = { x: 0, y: 0 };
        for (let index = 0; index < this.layerConfigs.length; index++) {
            const layerConfig = this.layerConfigs[index];
            const name = layerConfig.name || "base";
            const enable = layerConfig.enable && true;
            if (!enable) continue;

            const layer = LayerProvider.create(this.p5, layerConfig, basePoint);
            LayerLoader.LAYERS[name] = layer;
            if (!hasBasePoint) {
                basePoint = layer.startPoint;
                hasBasePoint = true;
            }
        }
    }
    public getLayers() {
        return LayerLoader.LAYERS;
    }
}
