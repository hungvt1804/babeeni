export class CurrentManager {
    public static CURRENT_PRODUCT: any = {
        fabrics: [],
        trims: [],
        text: {},
        smock: {
            type: "hand",
            data: [],
        }, // Smock là phần vải trắng, trên đó có thể là 3 icon thêu tay, hoặc thêu vải ren (geometric), hoặc là text
    };
    public static info() {
        console.log(`
        smock:  Smock là phần vải trắng, trên đó có thể là 3 icon thêu tay, hoặc thêu vải ren (geometric), hoặc là text\n
        trims: được hiểu là phần riềm tay, chân váy, phần này chỉ là dạng trim normal, là dạng zigzac
        đối với scallop smock hoặc zigzac smock phải hiển thị ở smock
        Fabric là vải
        applique thì không cần lưu do không hiển thị khi in
        `);
    }
    public static makeProduct(name: string, code: string) {
        this.CURRENT_PRODUCT = {
            fabrics: [],
            trims: [],
            text: {},
            smock: {
                type: "hand",
                data: [],
            },
        };
        this.CURRENT_PRODUCT.name = name;
        this.CURRENT_PRODUCT.code = code;
    }
    public static addFabricLayer(
        option = { layerName: "than-ao", nameGroup: "A", nameFabric: "F1" }
    ) {
        if (!this.CURRENT_PRODUCT.name)
            console.error(
                "Vui lòng nhập thông tin sản phẩm qua hàm makeProduct"
            );
        let checked = true;
        if (!option.layerName) {
            console.error("Fabric Layer cần có layer name");
            checked = false;
        }
        if (!option.nameGroup) {
            console.error(
                "Fabric Layer cần có Group Name - group này là A, B, C - theo vùng in của khách hàng gửi"
            );
            checked = false;
        }
        if (!option.nameFabric) {
            console.error("Fabric Layer cần có tên vải dạng F1, F2, F3");
            checked = false;
        }
        if (!checked) return;
        const layerName = option.layerName;
        this.updateOrInsert(option, "fabrics");
    }
    private static updateOrInsert(option: any, property: any) {
        const layerName = option.layerName;
        const properties = this.CURRENT_PRODUCT[property];
        let updated = false;
        for (let i = 0; i < properties.length; i++) {
            const element = properties[i];
            if (element.layerName == layerName) {
                properties[i] = option;
                updated = true;
                break;
            }
        }
        if (updated) {
            this.CURRENT_PRODUCT[property] = properties;
        } else {
            this.CURRENT_PRODUCT[property].push(option);
        }
    }
    // Đáng ra 3 layer trim là 1 thôi, hiện tại code đang để là 3, cần merge lại khi hiển thị
    public static addTrimLayer(
        option = { layerName: "trim-ao", nameColor: "Z1" }
    ) {
        let checked = true;
        if (!option.layerName) {
            console.error("Trim Layer cần có layer name");
            checked = false;
        }
        if (!option.nameColor) {
            console.error("Trim Layer cần có Color Name, dạng Z1, Z2, Z3...");
            checked = false;
        }
        if (!checked) return;
        this.updateOrInsert(option, "trims");
    }
    public static addMonogramLayer(
        option = {
            layerName: "text",
            fontDraw: "Tên font",
            textSize: 30,
            text: "Tech5s",
        }
    ) {
        let checked = true;
        if (!option.layerName) {
            console.error("Monogram Layer cần có layer name");
            checked = false;
        }
        if (!option.fontDraw) {
            console.error("Monogram Layer cần có loại font");
            checked = false;
        }
        if (!option.textSize) {
            console.error("Monogram Layer cần có Font Size");
            checked = false;
        }
        if (!option.text) {
            console.error("Monogram Layer cần có Nội dung");
            checked = false;
        }
        if (!checked) return;
        this.CURRENT_PRODUCT.text = option;
    }
    public static addSmock(
        option = {
            type: "hand|geometric",
            layerName: "text",
            image: "ảnh",
            image_preview: "ảnh preview",
        }
    ) {
        const currentType = this.CURRENT_PRODUCT.smock.type || "hand";
        if (currentType != option.type) {
            this.CURRENT_PRODUCT.smock.type = option.type;
            this.CURRENT_PRODUCT.smock.data = [];
        }

        this._addSmock(currentType, option);
    }

    public static addSmockHand(option: any) {
        option.type = "hand";
        this.addSmock(option);
    }
    public static addSmockGeometric(option: any) {
        option.type = "geometric";
        this.addSmock(option);
    }
    private static _addSmock(currentType: any, option: any) {
        let data = this.CURRENT_PRODUCT.smock.data;
        let checked: boolean = false;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.layerName == option.layerName) {
                data[i] = option;
                checked = true;
            }
        }
        if (!checked) {
            data.push(option);
        }

        if (currentType == "hand") {
            if (data.length > 3) {
                data = data.slice(data.length - 3);
            }
            this.CURRENT_PRODUCT.smock.data = data;
        } else if (currentType == "geometric") {
            if (data.length > 0) {
                data = data.slice(data.length - 1);
            }
            this.CURRENT_PRODUCT.smock.data = data;
        }
    }
}
