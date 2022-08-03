export class ConfigLoader {
    private static _CURRENT_TEMPLATE_NAME = "";
    public static get CURRENT_TEMPLATE_NAME() {
        return ConfigLoader._CURRENT_TEMPLATE_NAME;
    }
    public static set CURRENT_TEMPLATE_NAME(value) {
        ConfigLoader._CURRENT_TEMPLATE_NAME = value;
    }
    private inited = false;
    private _config: any;
    public get config(): any {
        return this._config;
    }
    public set config(value: any) {
        this._config = value;
    }
    private configUrl: any;
    constructor(config: any) {
        if (typeof config == "string") {
            this.configUrl = config;
        } else {
            this.config = config;
            ConfigLoader.CURRENT_TEMPLATE_NAME = this.config.name;
            this.inited = true;
        }
    }
    public async load(): Promise<void> {
        if (!this.inited) {
            await this.loadConfig();
        }
    }
    private async loadConfig(): Promise<void> {
        const config = await fetch(this.configUrl);
        this.config = await config.json();
        ConfigLoader.CURRENT_TEMPLATE_NAME = this.config.name;
    }
}
