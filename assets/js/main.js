jQuery(function($) {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        socket = io.connect(),
        brush_color = '#000000',
        worldObjects = {},
        currentArrow

    socket.on('imageload', function(data) {
        worldObjects = {}
        screenshot = new Screenshot(data.url, data.width, data.height, data.uuid, function() {
            $('#canvas').attr('width', data.width);
            $('#canvas').attr('height', data.height);
            this.draw(context)
        })
        worldObjects[screenshot.uuid] = screenshot
    });

    socket.on('draw', function(data) {
        if (worldObjects.hasOwnProperty(data.uuid)) {
            object = worldObjects[data.uuid]
            object.endX = data.endX
            object.endY = data.endY
        } else {
            worldObjects[data.uuid] = new Arrow(data.startX, data.startY, data.uuid)
        }

        context.clearRect(0, 0, canvas.width, canvas.height)
        for (var object in worldObjects) {
            worldObjects[object].draw(context)
        }
    })

    socket.on('clear', function() {
        worldObjects = {}
        context.clearRect(0,0, canvas.width, canvas.height)
    })

    canvas.addEventListener('mousedown', function(e) {
        var position = util.getMousePos(canvas, e)
        currentArrow = new Arrow(position.x, position.y, uuid.v4())
        worldObjects[currentArrow.uuid] = currentArrow
        socket.emit('draw', currentArrow)
        canvas.addEventListener('mousemove', onMouseMove, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', onMouseMove, false);
    }, false);

    function onMouseMove(e) {
        mouse = util.getMousePos(canvas, e);
        currentArrow.setEnd(mouse.x, mouse.y)
        socket.emit('draw', currentArrow)
        context.clearRect(0,0, canvas.width, canvas.height)
        for (var object in worldObjects) {
            worldObjects[object].draw(context)
        }
    }

    $('.block').on('click', function(e) {
        brush_color = $(this).data('color');
    });

    $('form').on('submit', function(e) {
        e.preventDefault();
        image = new Image();
        image.src = $('#name').val();
        image.onload = function() {
            $('#canvas').attr('width', image.width);
            $('#canvas').attr('height', image.height);
            worldObjects = {}
            screenshot = new Screenshot(image.src, image.width, image.height, uuid.v4(), function() {
                this.draw(context)
                socket.emit('imageload', {url: image.src, width: image.width, height: image.height, uuid: image.uuid})
            })
            worldObjects[screenshot.uuid] = screenshot

        }
    })

    $('.mydownload').on('click', function(e) {
        e.preventDefault();
        var rawImageData = canvas.toDataURL("image/png;base64")
        rawImageData = rawImageData.replace("image/png", "image/octet-stream")
        document.location.href = rawImageData
    })

    $('.clear').on('click', function(e) {
        socket.emit('clear')
        worldObjects = {}
        context.clearRect(0,0, canvas.width, canvas.height)
    })
});