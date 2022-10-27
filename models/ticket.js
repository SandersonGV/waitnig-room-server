let ticket = class {
    constructor(id, name, place, status) {
        this.id = id;
        this.name = name || place.type + "-" + (this.id + 1);
        this.place = place;
        this.status = status;
    }
}
module.exports = { ticket };