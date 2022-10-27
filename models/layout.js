
let layout = class {
    constructor(name) {
        this.id = Buffer.from(name).toString('base64')
        this.name = name;
        this.theme = {};
    }
}

module.exports = { layout };