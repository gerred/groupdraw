function Arrow(startX, startY, uuid) {
    this.startX = startX
    this.startY = startY
    this.endX = startX
    this.endY = startY
    this.uuid = uuid
}

Arrow.prototype.setEnd = function(x, y) {
    this.endX = x
    this.endY = y
}

Arrow.prototype.draw = function(context) {
    var angle = Math.atan2(this.endY-this.startY, this.endX-this.startX)
    var headlen = 10
    context.save()
    context.beginPath()
    context.moveTo(this.startX, this.startY)
    context.lineTo(this.endX, this.endY)
    context.lineTo(this.endX-headlen*Math.cos(angle-Math.PI/6), this.endY-headlen*Math.sin(angle-Math.PI/6))
    context.moveTo(this.endX, this.endY)
    context.lineTo(this.endX-headlen*Math.cos(angle+Math.PI/6), this.endY-headlen*Math.sin(angle+Math.PI/6))
    context.stroke()
    context.closePath()
    context.restore()
}