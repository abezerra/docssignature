var hummus = require('hummus');
const moment = require('moment')
moment.locale("pt-br")
let name = Date.now();
const hoje = moment().format('LLLL')

const img = __dirname + '/public/img/carimbo.png';

var pdfWriter = hummus.createWriterToModify(__dirname + '/public/doc/nd.pdf', {
	modifiedFilePath: __dirname + '/public/output/mocha.pdf'
});

const pdfhReader = hummus.createReader(__dirname + '/public/doc/nd.pdf')
console.log()
const numberOfPage = pdfhReader.getPagesCount();

// for (var i = 0; i <= pdfhReader.getPagesCount(); i--) {
	
// }
var pageModifier = new hummus.PDFPageModifier(pdfWriter, 0 , true);

var ctx = pageModifier.startContext().getContext();

pageModifier.startContext().getContext().writeText(
	'Revisado e aprovado pelo Departamento Jurídico da Brasal em ' + hoje,
	100, 800, {
		font: pdfWriter.getFontForFile(__dirname + '/public/fonts/Couri.ttf'),
		size: 8,
		colorspace: 'gray',
		color: 0x00
	}
);

ctx.drawImage(450, 700, img, {
	transformation: {
		width: 100,
		height: 100
	}
});

pageModifier.endContext().writePage();
pdfWriter.end();