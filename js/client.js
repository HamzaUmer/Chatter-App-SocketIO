const socket = io('http://localhost:8000');
//DOM elements from HTML file for editing through JS file
const senderContainer = document.getElementById('msgSender');
const msgInput = document.getElementById('messageEdit');
const msgContainer = document.querySelector('.container');
//This audio will play at recieving side
var tune = new Audio('media/tune.mp3');
//This is an append function which will add message container to our UI 
const append = (message, position) => {
    const msgElem = document.createElement('div');
    msgElem.innerText = message;
    msgElem.classList.add('msg');
    msgElem.classList.add(position);
    msgContainer.append(msgElem);
    if(position == 'msgLeft') {
        tune.play();
    }
}

//This prompt uses for asking name of new member of the chat
const name = prompt("Enter Your Name To Join");
socket.emit('new-member-joined', name);

//When new member joined chat it will show to every chat member message container
socket.on('member-joined', name => {
append(`${name} joined the chat`, 'msgRight')
})

//When member send a message it will recieve to every member a message and this event recieve from server
socket.on('recievedMessage', data => {
    append(`${data.name}: ${data.msg}`, 'msgLeft');
})

//When member left the chat this will show a left chat message container to every member
socket.on('leave', name => {
    append(`${name} left the chat`, 'msgLeft');
})

//This Event listener uses for no page load and handle message container
senderContainer.addEventListener('submit', (e)=> {
    e.preventDefault();
    const message = msgInput.value;
    append(`You: ${message}`,'msgRight');
    socket.emit('sendMessage', message);
    msgInput.value = "";
})