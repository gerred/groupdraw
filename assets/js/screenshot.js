function Screenshot(url, outWidth, outHeight, uuid, cb) {
    this.ready = false
    this.image = new Image();
    this.image.src = url
    this.image.onload = function() {
        this.ready = true
        if (typeof cb === 'function') cb.call(this)
    }.bind(this)
    this.outWidth = outWidth
    this.outHeight = outHeight
    this.uuid = uuid
}

Screenshot.prototype.draw = function(context) {
    if (this.ready) {
        context.save()
        context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.outWidth, this.outHeight)
        context.restore()
    }
}