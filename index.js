const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { environment } = require("./environment.js");

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

let environments = [];
io.on('connection', (socket) => {
    socket.on('queue', (call) => {
        let env = environments.find(o => o.id == call.env);
        let ticket = env.addTicketToQueue(call.placeid, call.text);
        io.emit('print',ticket)
        io.emit('call', env);
    });

    socket.on('call', (call) => {
        let env = environments.find(o => o.id == call.env);
        env.callTicket(call.id, call.nomeCliente)
        io.emit('call', env);
    });

    socket.on('dropCall', (call) => {
        let env = environments.find(o => o.id == call.env);
        env.dropCall(call.id)
        io.emit('call', env);
    });
    
    socket.on('createEnv', (envData) => {
        if(envData.id){
            let index = environments.findIndex(o => o.id == envData.id);
            if(index>=0)
            {
                environments[index].url = envData.url
                environments[index].name = envData.name
                environments[index].places = envData.places
            }
        }else{
            let env = new environment(envData.name)
            env.url = envData?.url || "";

            if (envData?.places) {
                envData?.places.forEach(el => {
                    env.addPlace(el.name, el.type);
                });
            }
            environments.unshift(env);
        }
        io.emit('createEnv', environments);
    });

    socket.on('listEnv', (envName) => {
        socket.emit('listEnv', environments);
    });

    socket.on('initTotem', (envid) => {
        let env = environments.find(o => o.id == envid);
        socket.emit('initTotem', { places: env.places, envName:env.name });
    });

    socket.on('initWaitRoom', (envid) => {
        let env = environments.find(o => o.id == envid);
        socket.emit('initWaitRoom', env);
    });

    socket.on('initAtendente', (envid) => {
        let env = environments.find(o => o.id == envid);
        socket.emit('call', env);
    });
});
server.listen(3000, () => {
    let env = new environment("teste");
    env.url ="https://animesher.com/orig/1/112/1123/11230/animesher.com_kawaii-tony-tony-chopper-one-piece-1123098.gif"
    env.addPlace("salão", "SL");
    env.addPlace("primeiro andar", "A1");
    env.addPlace("segundo andar", "A2");
    env.addPlace("cobertura", "CB");
    environments.push(env);

    console.log('listening on *:3000');
    console.log('http://localhost:3000/');
});