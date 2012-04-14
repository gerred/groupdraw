var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    public = __dirname + '/public',
    stylesheets = __dirname + '/assets/css';

var app = express.createServer(),
    io = require('socket.io').listen(app);

io.configure(function() {
    io.set('transports', ['xhr-polling']);
    io.set('polling duration', 1)
})

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib());
}

app.configure(function() {
    app.use(stylus.middleware({
        src: stylesheets,
        dest: public,
        compile: compile
    }));
    app.use(express.static(public));
    app.set('view engine', 'jade');
    app.set('view options', {layout: false});
    app.use(express.logger());
})

require('./routes/index.js')(app);

var port = process.env.PORT || 8080;

app.listen(port);

io.sockets.on('connection', function(socket) {
    socket.on('draw', function(data) {
        socket.broadcast.emit('draw', data);
    })

    socket.on('imageload', function(data){
        socket.broadcast.emit('imageload', data);
    })
});

console.log('Server listenining on port %d in %s mode',
    port,
    app.settings.env
);