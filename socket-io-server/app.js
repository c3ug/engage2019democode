const express = require("express");
var cors = require('cors');
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express().use('*', cors());

app.use(index);


const server = http.createServer(app);
const io = socketIo(server);

var login = 0;
var response = 0;
var readqotd =0;
var results = 0;
var questionlist=0;

function handleApiCalls(msg) {
    var back = [];
    if(msg == "login") {
        login++;
        console.info(login);
    }
    if(msg == "response") {
        response++;
        console.info(response);
    }
    if(msg == "readqotd") {
        readqotd++;
        console.info(readqotd);
    }
    if(msg == "results") {
        results++;
        console.info(results);
    }
    if(msg == "questionlist") {
        questionlist++;
        console.info(questionlist);
    }
    back.push({"x":"Logins","calls":login});
    back.push({"x":"Responses","calls":response});
    back.push({"x":"Get QOTD","calls":readqotd});
    back.push({"x":"Get results","calls":results});
    back.push({"x":"Questionlist","calls":questionlist});
    return back;
}



io.on("connection", socket => {
    
    socket.on("connect", function(from,msg){
        var back = new Array();
        back = handleApiCalls(msg);
        io.emit("TestWithAPI",back);
    });
    socket.on("APICall", function(from, msg) {
        
        var back = new Array();
        back = handleApiCalls(msg);
        
        
        io.emit("TestWithAPI",back);
        
    });
    socket.on('join', function(data) {
        var back = new Array();
        back = handleApiCalls(msg);
        
        
        io.emit("TestWithAPI",back);
    });
  
  socket.on("disconnect", () => console.log("Client disconnected"));
});



server.listen(port, () => console.log(`Listening on port ${port}`));
