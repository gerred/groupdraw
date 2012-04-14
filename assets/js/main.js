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
    });

    socket.on('imageload', function(data) {
        image = new Image();
        image.src = data.url
        image.onload = function() {
            $('#canvas').attr('width', data.width);
            $('#canvas').attr('height', data.height);
            context.save();
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, data.width, data.height);
            context.restore();
        }
    });

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

    $('form').on('submit', function(e) {
        e.preventDefault();
        image = new Image();
        image.src = $('#name').val();
        image.onload = function() {
            socket.emit('imageload', {width: image.width*.75, height: image.height*.75, url: image.src})
            $('#canvas').attr('width', image.width*.75);
            $('#canvas').attr('height', image.height*.75);
            context.save();
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width*0.75, image.height*0.75);
            context.restore();
        }
    })
});