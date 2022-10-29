const { environment } = require("../models/environment.js");

let environmentService = class {
    constructor() {
        this.environments = [];
    }
    
    getAllEnvironment = () => {
        return this.environments;
    }

    getEnvironment = (id) => {
        return this.environments.find(o => o.id == id);
    }

    createEnvironment = (name,url,places,layout, theme) =>{
        let env = new environment(name)
        env.url = url || "";
        env.layout =  layout || "";
        env.theme =  theme || "";
        if (places) {
            places.forEach(el => {
                env.addPlace(el.name, el.type);
            });
        }
        this.environments.unshift(env);
    }

    addEnvironment = (env) =>{
        this.environments.push(env);
    }

    editEnvironment = (env) =>{
        let index = this.environments.findIndex(o => o.id == env.id);
        if(index>=0)
        {
            this.environments[index].url = env.url
            this.environments[index].name = env.name
            this.environments[index].places = env.places
            this.environments[index].layout = env.layout
            this.environments[index].theme = env.theme
        }
    }

    dropEnvironment = (id) =>{
        let index = this.environments.findIndex(o => o.id == env.id);
        if (index >= 0) {
            this.environments.splice(index, 1);
        }
    }

    addTicketToQueue = (call) => {
        let index = this.environments.findIndex(o => o.id == call.env);
        let ticket = this.environments[index].addTicketToQueue(call.placeid, call.text);
        return ticket;
    }

    callTicket = (call)=>{
        let index = this.environments.findIndex(o => o.id == call.env);
        this.environments[index].callTicket(call.id, call.nomeCliente);
        return this.environments[index];
    }

}


module.exports = { environmentService };