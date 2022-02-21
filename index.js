const port = process.env.PORT || 8000;
const io = require('socket.io')(port, {
    cors:{
        origin:'*',
    }
});

const members = {};

io.on('connection', socket => {
    //When someone join a chat this event show to every member notification
    socket.on('new-member-joined', name => {
        members[socket.id] =name;
        socket.broadcast.emit('member-joined', name);
    });
    //When member of the chat send a message this socket event show this message to every member
    socket.on('sendMessage', msg => {
        socket.broadcast.emit('recievedMessage', {msg: msg, name: members[socket.id]})
    });
//If any member disconnect from a chat so this socket event show left chat noti to every member chat container
    socket.on('disconnect', msg => {
        socket.broadcast.emit('leave', members[socket.id]);
        delete members[socket.id];
    });

});