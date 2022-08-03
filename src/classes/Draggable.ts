class Draggable {
    private dragging: boolean;
    private rollover: boolean;
    private x: number;
    private y: number;
    private w: number;
    private h: number;
    private offsetX: number;
    private offsetY: number;
    private _p5: any;
    protected get p5(): any {
        return this._p5;
    }
    protected set p5(value: any) {
        this._p5 = value;
    }
    constructor(p5: any) {
        this.p5 = p5;
        this.dragging = false;
        this.rollover = false;

        this.x = 100;
        this.y = 100;
        this.w = 75;
        this.h = 50;
    }

    over() {
        if (
            this.p5.mouseX > this.x &&
            this.p5.mouseX < this.x + this.w &&
            this.p5.mouseY > this.y &&
            this.p5.mouseY < this.y + this.h
        ) {
            this.rollover = true;
        } else {
            this.rollover = false;
        }
    }

    update() {
        if (this.dragging) {
            this.x = this.p5.mouseX + this.offsetX;
            this.y = this.p5.mouseY + this.offsetY;
        }
    }

    show() {
        if (this.dragging) {
            this.showDragging();
        } else if (this.rollover) {
            this.showOver();
        } else {
            this.showNormal();
        }
    }
    showDragging() {}
    showOver() {}
    showNormal() {}
    pressed() {
        if (
            this.p5.mouseX > this.x &&
            this.p5.mouseX < this.x + this.w &&
            this.p5.mouseY > this.y &&
            this.p5.mouseY < this.y + this.h
        ) {
            this.dragging = true;
            this.offsetX = this.x - this.p5.mouseX;
            this.offsetY = this.y - this.p5.mouseY;
        }
    }

    released() {
        this.dragging = false;
    }
}
