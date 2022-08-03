import { FullInfoP5 } from "../main";
import { InfoTabletr } from "./InfoTableTr";

export class InfoTable {
    private startX: any;
    private startY: any;
    private trWidth: any;
    private trHeight: any;
    private p5: any;
    private rows: any;
    private texts: any;
    private _colSpan = false;
    public get colSpan() {
        return this._colSpan;
    }
    public set colSpan(value) {
        this._colSpan = value;
    }
    constructor(
        p5: any,
        startX: number,
        startY: number,
        trWidth: number,
        trHeight: number,
        rows: number = 0,
        texts: any = []
    ) {
        this.p5 = p5;
        this.startX = startX;
        this.startY = startY;
        this.trWidth = trWidth;
        this.trHeight = trHeight;
        this.rows = rows;
        this.texts = texts;
    }
    public draw() {
        for (let row = 0; row < this.rows; row++) {
            const topLeftX = this.startX;
            const topLeftY = this.startY + row * this.trHeight;
            const tr = new InfoTabletr(
                this.p5,
                topLeftX,
                topLeftY,
                this.trWidth,
                this.trHeight
            );
            if (this.colSpan) {
                if (row == 0) {
                    if (this.rows == 1) {
                        tr.draw(true, true);
                    } else {
                        tr.draw(false, true);
                    }

                    tr.drawText(this.texts[row][0], 0);
                } else if (row == this.rows - 1) {
                    tr.draw(true, false);
                } else {
                    tr.draw(true, true);
                }
                if (row == 0 && row == this.rows - 1) {
                }
            } else {
                tr.draw();
            }
            for (let col = 0; col < this.texts[row].length; col++) {
                if (!this.colSpan || col != 0) {
                    tr.drawText(this.texts[row][col], col);
                }
            }
        }
    }
}
