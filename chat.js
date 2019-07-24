const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use('/style', express.static(__dirname + '/style'));

io.on('connection', (socket) => {
    socket.username = 'guest';

    socket.on('message',(msg) => {
        io.emit('message', {'username' : socket.username,'message' : msg});
    });

    socket.on('join', (username) => {
        if(username != null){
            socket.username = username
        }
        socket.broadcast.emit('message', {'username' : socket.username, 'message' : ' <em style="color:red;">Joined the room.</em>'});
        socket.emit('user',socket.username);
    }); 

    socket.on('disconnect', () => {
        io.emit('user left', {'username' : socket.username, 'message' : '<em style="color:red;">Left the room.</em>'});
    });


    console.log('someone connected');

});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(process.env.PORT || 3000, () => {
    console.log('listening on port ', process.env.PORT || 3000);
});


