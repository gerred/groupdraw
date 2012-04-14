jQuery(function($) {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        imagedata = context.getImageData(0, 0, canvas.width, canvas.height),
        pixels = imagedata.data,
        brush_color,
        brush_size = 10,
        brush_density = 100,
        socket = io.connect(),
        buffer = [];

    socket.on('draw', function(data) {
        context.save();
        context.beginPath();
        initialPoint = data.shift();
        context.moveTo(initialPoint[0], initialPoint[1]);
        for (var i = 0; i < data.length; i++) {
            context.lineTo(data[i][0], data[i][1]);
        }
        context.stroke();
        context.closePath();
        context.restore();
    })

    canvas.addEventListener('mousedown', function(e) {
        context.beginPath();
        position = util.getMousePos(canvas, e);
        context.moveTo(position.x, position.y);
        buffer.push([position.x,position.y]);
        canvas.addEventListener('mousemove', onMouseMove, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
        context.closePath();
        socket.emit('draw', buffer);
        buffer = [];
        canvas.removeEventListener('mousemove', onMouseMove, false);
    }, false);

    function onMouseMove(e) {
        mouse = util.getMousePos(canvas, e);
        context.lineTo(mouse.x, mouse.y);
        context.stroke();
        buffer.push([mouse.x, mouse.y]);
    }
});