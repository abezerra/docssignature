const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
var hummus = require('hummus');

const moment = require('moment')
moment.locale("pt-br")

const img = __dirname + '/public/img/carimbo.png';
const name = Date.now();
const hoje = moment().format('LLLL')

//assina o documento
function assina(file) {

}

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    var ximbica = file.fieldname + Date.now() + path.extname(file.originalname)
    cb(null, ximbica);
    assina(ximbica)
    console.log(ximbica);

    setTimeout(() => {

      var pdfWriter = hummus.createWriterToModify(__dirname + '/public/uploads/' + ximbica, {
        modifiedFilePath: __dirname + '/public/output/' + name + '.pdf'
      });

      var pageModifier = new hummus.PDFPageModifier(pdfWriter, 0);

      var ctx = pageModifier.startContext().getContext();

      pageModifier.startContext().getContext().writeText(
        'Revisado e aprovado pelo Departamento Jurídico da Brasal em ' + hoje,
        100, 20, {
          font: pdfWriter.getFontForFile(__dirname + '/public/fonts/Couri.ttf'),
          size: 8,
          colorspace: 'gray',
          color: 0x00
        }
      );
      
      ctx.drawImage(450, 40, img, {
        transformation: {
          width: 100,
          height: 100
        }
      });

      pageModifier.endContext().writePage();
      pdfWriter.end();
    }, 999)
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Erro ao assinar documento!');
  }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {

  upload(req, res, (err) => {
    if (err) {
      res.render('index', {
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('index', {
          msg: 'Arquivo assinado com sucesso!',
          file: `output/${name}.pdf`
        });
      }
    }
  });
});



const port = 3002;

app.listen(port, () => console.log(`Brasal Signatures is running on por ${port}`));