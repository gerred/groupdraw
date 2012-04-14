var request = require('request');
module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('/:id', function(req, res) {
        request('http://gerred.showoff.io/' + req.params.id).pipe(res);
    });
}