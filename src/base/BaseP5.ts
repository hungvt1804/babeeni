abstract class BaseP5{
    private _p5: any;
    public get p5(): any {
        return this._p5;
    }
    public set p5(value: any) {
        this._p5 = value;
    }
    constructor(p5:any){
        this.p5 = p5;
    }
    abstract preload():void;
    abstract setup():void;
    abstract draw():void;
}
export default BaseP5;