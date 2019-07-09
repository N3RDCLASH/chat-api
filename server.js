const express = require('express');
const app = express();
const session = require('express-session');
users = [];
connections = [];


const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
server.listen(3000);
console.log('server running...');


// app.use(session)
// Login page
app.use(express.static('public'));

// Socket Connections
io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //diconnect
    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconnected %s sockets connected',connections.length);
    });
    
    //Typing event handler
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
        console.log('username:'+ data);
    });
    
    //send message
    socket.on('send message', function(data){
        console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });
    // New User handler 
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
        console.log('New user '+ data +' logged on...');
    });
    
    function updateUsernames(){
        io.sockets.emit('get users', users)
    }
})
