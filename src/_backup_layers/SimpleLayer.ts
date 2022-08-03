import { BaseLayer } from "./BaseLayer";

export class SimpleLayer extends BaseLayer {
    public render() {
        if (this.forbidden) return;
    }
}
