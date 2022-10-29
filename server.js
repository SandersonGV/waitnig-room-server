const cors = require('cors');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { environment } = require("./models/environment.js");
const { environmentService } = require("./services/environmentService");

const io = new Server(server,{
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"]
    }
  });

app.use(cors());
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

let envSevice = new environmentService();

io.on('connection', (socket) => {
    socket.on('queue', (call) => {
        console.log('queue',call)
        let ticket = envSevice.addTicketToQueue(call);
        let env = envSevice.getEnvironment(call.env);
        console.log('29',call)
        socket.emit('print',ticket)
        io.emit('call', env);
    });

    socket.on('call', (call) => {
        let env = envSevice.callTicket(call);
        console.log('37',call)
        io.emit('call', env);
    });

    socket.on('dropCall', (call) => {
        let env = envSevice.getEnvironment(call.env);
        env.dropCall(call.id)
        io.emit('call', env);
    });
    
    socket.on('createEnv', (envData) => {
        if(envData.id){
            let env = envSevice.getEnvironment(envData.id);
            console.log(env)
            if(env)
            {
                envSevice.editEnvironment(envData)
            }
        }else{
            envSevice.createEnvironment(
                envData.name,
                envData?.url,
                envData?.places,
                envData?.layout,
                envData?.theme
                );
        }
        
        io.emit('createEnv', envSevice.getAllEnvironment());
    });

    socket.on('listEnv', (envName) => {
        socket.emit('listEnv', envSevice.getAllEnvironment());
    });

    socket.on('initTotem', (envid) => {
        let env = envSevice.getEnvironment(envid);
        socket.emit('initTotem', { places: env.places, envName:env.name });
    });

    socket.on('initWaitRoom', (envid) => {
        let env = envSevice.getEnvironment(envid);
        socket.emit('initWaitRoom', env);
    });

    socket.on('initAtendente', (envid) => {
        let env = envSevice.getEnvironment(envid);
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
    env.layout = {id:3,nome:"somente numero", recentCalls:1, lastCalls:0};
    env.theme = {
        "cor1": "#efe6e6",
        "cor2": "#ee9b9b",
        "cor3": "#ee4f4f",
        "cor4": "#ff0000"
    };
    envSevice.addEnvironment(env);

    console.log('listening on *:3000');
    console.log('http://localhost:3000/');
});