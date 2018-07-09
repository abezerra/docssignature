const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const moment = require('moment')
moment.locale("pt-br")
//assinatura dos documentos 
var watermark = require('image-watermark');

let name =  Date.now();
const hoje = moment().format('LLLL')

const options = {
  'text': 'Revisado e aprovado pelo Departamento Jurídico da Brasal em ' + hoje,
  'dstPath': __dirname + '/public/doc/' + name + '.pdf',
  'align': 'ltr',
  'pointsize': 10,
  //'position': 'SouthWest',
  'position': 'SouthEast',
  'color' : 'rgb(154, 50, 46)'
}

//assina o documento
function assina(file){
  //watermark.embedWatermark(file, options);
  let cu = __dirname + '/public/uploads/'+ file;
  console.log('a porra do lugar onde o arquivo esta', cu);
  
  watermark.embedWatermark(cu, options);
}

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    ximbica = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    
  //watermark.embedWatermark(__dirname + '/public/uploads/'+ ximbica, options);

    
    cb(null,ximbica);
    assina(ximbica)
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype){
    return cb(null,true);
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
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        
        console.log('a porra da ximbica no fim', ximbica)
        res.render('index', {
          msg: 'Arquivo assinado com sucesso!',
          file: `doc/${name}.pdf`
        });
      }
    }
  });
});



const port = 3000;

app.listen(port, () => console.log(`Brasal Signatures is running on por ${port}`));