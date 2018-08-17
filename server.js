const express = require('express');
const app = express();

const path = require("path");
app.set('views', path.join(__dirname,'./views'));
app.set('view engine','ejs');

const session = require("express-session");

app.use(session({
    secret: 'alfredofrancisco',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

var current_users = [];
var current_messages = [];

app.get('/', function(req,res) {
    context = {
        'current_messages':current_messages,
        'current_users':current_users
    }
    res.render('index',context);
});

const server = app.listen(1337);
console.log("listening on port 1337")

const io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log(socket.id)

    socket.on('got_a_username', function(data) {
        current_users.push(data);
        io.emit('new_user_to_list',data)
    })

    socket.on('new_message',function(data) {
        msg = {
            'message':data.values,
            'author':data.name
        }
        current_messages.push(msg);
        io.emit('add_new_message',msg);
    });

});