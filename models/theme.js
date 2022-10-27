let theme = class {
    constructor(name) {
        this.id = Buffer.from(name).toString('base64')
        this.name = name;
        this.cor1 = "";
        this.cor2 = "";
        this.cor3 = "";
        this.cor4 = "";

    }
}

module.exports = { theme };