let environment = class {
    constructor(name) {
        this.id = Buffer.from(name).toString('base64')
        this.name = name;
        this.calls = [];
        this.queue = [];
        this.places = [];
        this.media = {};
        this.data = new Date();
    }

    addPlace = (name, type) => {
        let placeid = this.places.length + 1;
        this.places.push(new place(placeid, type, name))
    }

    addTicketToQueue = (placeid, text) => {
        let ticketid = this.calls.length + 1;
        let index = this.places.findIndex(o => o.id == placeid);
        let place = this.places[index];
        let name = text ?? place.type + "-" + (this.calls.filter(obj => obj.place.type == place.type).length + 1);
        let newticket = new ticket(ticketid, name, place, "1")
        this.calls.unshift(newticket);
        return newticket;
    }

    callTicket = (tickeid,nomecliente) => {
        let index = this.calls.findIndex(a => a.id == tickeid)
        if (index >= 0) {
            let myticket = this.calls[index];
            myticket.status = "2";
            
            if(nomecliente)
                myticket.name = nomecliente

            this.calls.splice(index, 1);
            this.calls.unshift(myticket);
        }
    }

    dropCall = (tickeid) => {
        let index = this.calls.findIndex(a => a.id == tickeid)
        if (index >= 0) {
            this.calls.splice(index, 1);
        }
    }
}


let ticket = class {
    constructor(id, name, place, status) {
        this.id = id;
        this.name = name || place.type + "-" + (this.id + 1);
        this.place = place;
        this.status = status;
    }
}

let place = class {
    constructor(id, type, name) {
        this.id = id;
        this.type = type;
        this.name = name;
    }
}


module.exports = { environment, ticket };