import { CircleTextLayer } from "./CircleTextLayer";
import { ImageLayer } from "./ImageLayer";
import { PolygonLayer } from "./PolygonLayer";
import { TextLayer } from "./TextLayer";
import { TrimLayer } from "./TrimLayer";

export class LayerProvider {
    static create(
        p5: any,
        layerConfig: any,
        positionBase: any = { x: 0, y: 0 }
    ) {
        const type = layerConfig.type || "";
        switch (type) {
            case "image":
                return new ImageLayer(p5, layerConfig, positionBase);
            case "polygon":
                return new PolygonLayer(p5, layerConfig, positionBase);
            case "text":
                return new TextLayer(p5, layerConfig, positionBase);
            case "circle_text":
                return new CircleTextLayer(p5, layerConfig, positionBase);
            case "trim":
                return new TrimLayer(p5, layerConfig, positionBase);
        }
    }
}
