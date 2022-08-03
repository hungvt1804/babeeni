import { P5Helper } from "../helpers/P5Helper";

export class HistoryManger {
    private undoStack: any = [];
    private redoStack: any = [];
    private initState: any = null;
    private inited: boolean = false;
    private maxStack = 100;
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }
    public init(state: any): void {
        this.initState = state;
        this.redoStack.push(state);
        this.inited = true;
        console.log(
            `History Manager created with max stack = ${this.maxStack}!`
        );
    }
    public push(state: any): void {
        let currentState;
        if (!(currentState = this.popCurrentState())) {
            this.init(state);
            this.fireEvent("init");
        } else {
            if (!this.inited) return;
            this.undoStack.push(currentState);
            this.undoStack.slice(-this.maxStack);
            this.resetRedoStack();
            this.redoStack.push(state);
            this.fireEvent("push");
        }
    }
    public prev(): any {
        if (!this.inited) return;
        if (this.undoStack.length > 0) {
            const state = this.undoStack.pop();
            this.redoStack.push(state);
            this.fireEvent("prev");
            return state;
        }
    }
    public next(): any {
        if (!this.inited) return;
        if (this.redoStack.length > 1) {
            const state = this.popCurrentState();
            this.undoStack.push(state);
            this.fireEvent("next");
            return this.redoStack[this.redoStack.length - 1];
        }
    }
    public babeePrev() {
        const historyConfig = this.prev();
        if (historyConfig) {
            P5Helper.applyConfig(historyConfig);
        }
    }
    public babeeNext() {
        const historyConfig = this.next();
        if (historyConfig) {
            P5Helper.applyConfig(historyConfig);
        }
    }
    public prevLength() {
        return this.undoStack.length;
    }
    public nextLength() {
        return this.redoStack.length;
    }
    public reset() {
        if (!this.inited) return;
        this.resetUndoStack();
        this.resetRedoStack();
        this.redoStack.push(this.initState);
    }
    public log() {
        console.log("Redo Stack", this.redoStack);
        console.log("Undo Stack", this.undoStack);
    }
    private popCurrentState() {
        return this.redoStack.pop();
    }
    private resetUndoStack(): void {
        this.undoStack.length = 0;
    }
    private resetRedoStack(): void {
        this.redoStack.length = 0;
    }
    private fireEvent(info: any) {
        var evt = new CustomEvent("babee_history_change", {
            detail: info,
        });
        window.dispatchEvent(evt);
    }
}
