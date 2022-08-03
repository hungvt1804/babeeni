import { BaseLayer } from "../layers/BaseLayer";
import { ConfigLoader } from "../loader/ConfigLoader";
import { LayerLoader } from "../loader/LayerLoader";

export class P5Helper {
    static options: any = {};
    static p5: any;
    static APPLICATION_IS_DIRTY = true;
    static APPLY_HISTORY = false;
    public static init(p5: any, options: any) {
        P5Helper.p5 = p5;
        P5Helper.options = options;
    }
    public static clear(p5: any) {
        p5.clear();
        p5.background(P5Helper.options.background || 255);
    }
    public static isMoveable() {
        return (
            LayerLoader.CURRENT_LAYER_MOVEABLE != "" &&
            LayerLoader.CURRENT_LAYER_MOVEABLE != "0"
        );
    }
    public static getHistoryObject() {
        const listLayers = LayerLoader.LAYERS;
        const results: any = {};
        const layers: any = [];
        for (const [key, item] of Object.entries(listLayers)) {
            const currentLayer = item as BaseLayer;
            results.name = ConfigLoader.CURRENT_TEMPLATE_NAME;
            const tmp: any = currentLayer.toHistoryObject();
            layers.push(tmp);
        }
        results.layers = layers;
        return results;
    }
    public static applyConfig(historyConfig: any) {
        const historyLayerConfigs = historyConfig.layers;
        const layers = LayerLoader.LAYERS;
        for (const [key, layer] of Object.entries(layers)) {
            const tmpLayer = layer as BaseLayer;
            const layerConfig = historyLayerConfigs.find(
                (layerConfig: any, index: number) => {
                    if (layerConfig.name == tmpLayer.layerName) return true;
                }
            );
            if (layerConfig) {
                tmpLayer.applyHistory(layerConfig);
            }
        }
        P5Helper.setApplyHistory(true);
    }
    public static exportJsonObject() {
        const listLayers = LayerLoader.LAYERS;
        const results: any = {};
        const layers: any = [];
        for (const [key, item] of Object.entries(listLayers)) {
            const currentLayer = item as BaseLayer;
            results.name = ConfigLoader.CURRENT_TEMPLATE_NAME;
            const tmp: any = currentLayer.toJsonable();
            layers.push(tmp);
        }
        results.layers = layers;
        return results;
    }
    public static exportJsonString() {
        const json = P5Helper.exportJsonObject();
        return JSON.stringify(json);
    }
    public static exportJson() {
        const json = P5Helper.exportJsonObject();
        P5Helper.p5.saveJSON(json, "config.json");
    }
    public static needDraw() {
        return P5Helper.isDirty() || P5Helper.isApplyHistory();
    }
    public static isApplyHistory() {
        return P5Helper.APPLY_HISTORY;
    }
    public static setApplyHistory(apply: boolean) {
        return (P5Helper.APPLY_HISTORY = apply);
    }
    public static isDirty() {
        return P5Helper.APPLICATION_IS_DIRTY;
    }
    public static setDirty(dirty: boolean) {
        return (P5Helper.APPLICATION_IS_DIRTY = dirty);
    }
}
