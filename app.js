var pdf = require('html-pdf');
var path = require('path');

// this is very important, you have to put file:// before your path
// and normalize the resulting path
//var imgSrc = 'file://' + __dirname + '/350x120.png';
var imgSrc = 'file://' + __dirname + '/img/ok.png';
imgSrc = path.normalize(imgSrc);
// or var imgSrc = path.join('file://', __dirname, '/350x120.png');

// Options
var options = {
    "header": {
      "height": "5mm",
      "contents": ""
    },
    "footer": {
      "height": "3mm",
      "contents": "<span style='color: #444;'>{{page}}</span>/<span>{{pages}}</span>"
    }
  }
// put your entire header here and the content of the page outside the <div id="pageHeader"></div>
var result = "<div id='pageHeader'><img src='" + imgSrc + "' /><div style='text-align: center;'>Author: Marc Bachmann</div></div>";
result += "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>";
var fileName = __dirname + '/doc/xpto.pdf';
pdf.create(result, options).toFile(fileName, function(err, res) {
  if (err) {
    console.error(err);
  }
});

