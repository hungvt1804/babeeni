import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { FullInfoP5 } from "../main";

export class InfoTabletr {
    private startX: any;
    private startY: any;
    private width: any;
    private height: any;
    private p5: any;
    protected topLeft: any;
    protected topRight: any;
    protected bottomLeft: any;
    protected bottomRight: any;

    constructor(
        p5: any,
        startX: number,
        startY: number,
        width: number,
        height: number
    ) {
        this.p5 = p5;
        this.startX = startX;
        this.startY = startY;
        this.width = width;
        this.height = height;

        const trHeight = this.height;
        const tableWidth = this.width;
        const topLeftX = this.startX;
        const topLeftY = this.startY;
        const bottomRightX = topLeftX + tableWidth;
        const bottomRightY = topLeftY + trHeight;
        const bottomLeftX = topLeftX;
        const bottomLeftY = topLeftY + trHeight;
        const topRightX = topLeftX + tableWidth;
        const topRightY = topLeftY;

        this.topLeft = { x: topLeftX, y: topLeftY };
        this.topRight = { x: topRightX, y: topRightY };
        this.bottomLeft = { x: bottomLeftX, y: bottomLeftY };
        this.bottomRight = { x: bottomRightX, y: bottomRightY };
    }
    public draw(hafttop = false, haftBottom = false) {
        this.p5.stroke("#ccc");

        this._drawLine(this.topLeft, this.bottomLeft);
        this._drawLine(this.topRight, this.bottomRight);

        this.drawTd();
        if (hafttop) {
            const tmpTopLeft = {
                x: this.topLeft.x + this.width / 2,
                y: this.topLeft.y,
            };
            this._drawLine(tmpTopLeft, this.topRight);
        } else {
            this._drawLine(this.topLeft, this.topRight);
        }
        if (haftBottom) {
            const tmpBottomLeft = {
                x: this.bottomLeft.x + this.width / 2,
                y: this.bottomLeft.y,
            };
            this._drawLine(tmpBottomLeft, this.bottomRight);
        } else {
            this._drawLine(this.bottomLeft, this.bottomRight);
        }
    }

    private drawTd() {
        const start = {
            x: this.topLeft.x + this.width / 2,
            y: this.topLeft.y,
        };
        const end = {
            x: this.bottomLeft.x + this.width / 2,
            y: this.bottomRight.y,
        };
        this._drawLine(start, end);
    }

    public drawText(text: any, cell: number) {
        let textStartY =
            this.topLeft.y + this.height / 2 - FullInfoP5.TEXT_SIZE / 2;
        let textStartX = this.topLeft.x + 5;
        if (cell == 1) {
            textStartX = this.topLeft.x + this.width / 2 + 5;
        }
        this.p5.text(text, textStartX, textStartY);
    }

    private _drawLine(start: any, end: any) {
        this.p5.line(start.x, start.y, end.x, end.y);
    }
}
