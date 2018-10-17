// var express = require('express');
// var app = express();
// app.use(express.static('myApp'));
// app.get('/', function (req, res,next) {
//  res.redirect('/'); 
// });
// app.listen(8080, 'localhost');
// console.log('MyProject Server is Listening on port 8080');


var express = require('express'),
app = express();

app.use(express.static(__dirname));
app.get('/', function(req, res) {
    res.sendfile('index.html', {root: __dirname })
});
var server = app.listen(process.env.PORT || 8080);