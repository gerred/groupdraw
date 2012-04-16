var request = require('request');
module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('/:id', function(req, res) {
        request('http://66.228.53.55:3000/' + req.params.id).pipe(res);
    });
}