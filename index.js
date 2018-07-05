var watermark = require('image-watermark');
var fileName = __dirname + '/doc/xpto.pdf';
let name =  Date.toString;
let options = {
    'text': 'A P R O V A D O',
    'dstPath': __dirname + '/doc/' + name + '.pdf',
    'align': 'ltr',
    'pointsize': 40,
    'position': 'SouthWest',
}

watermark.embedWatermark(fileName, options);