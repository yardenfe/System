const express = require ('express');
const app = express();
const path = require('path');
const BodyParser = require('body-parser');
const sql= require('./db/db');
const CRUD = require('./db/CRUD');
const port = 3000;
const dbConfig = require ('./db/db.config')
const CreateDB = require('./db/CreateDB');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const http = require('http')



app.use(express.static(path.join(__dirname,'minimal/static')));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended:true}));
app.use(cookieParser());

app.set("views", path.join(__dirname, "minimal/Views"));
app.set("view engine",'pug');

// Configuration
cloudinary.config({
  cloud_name: "dwxlduhe0",
  api_key: "256392223264485",
  api_secret: "w1vTkv_26U6LjJDvFsSg450fZdE"
});

app.listen(port, () =>{
    console.log("server is running on port ", port);
})

//routs
app.get('/', (req,res) =>{
    res.redirect('/Login');
});
app.get("/Login", (req,res) => {
    res.render('Login');
});
app.get("/SignUp", (req,res) => {
    res.render('SignUp');
});

app.get("/CreateProject", (req,res) => {
    res.render('CreateProject');
});

app.get("/Upload3dModel",(req,res)=>{
    res.render('UploadCloudinary');
});

app.get("/documentDetails",(req,res) => {
    res.render('DocumentPage');
});


app.post("/log_in_check", CRUD.checklogin); //modelwithnotes

app.get("/yourProjects", CRUD.getFiles); //modelwithnotes

app.post("/insertNewAccount", CRUD.insertNewAccount);
app.post("/insertNewProject", CRUD.insertNewProject);

///3 different quereys

//מציג את המודלים שמשויכים לפרויקט מסויים
app.get("/findModel/:project_id",(req,res)=>{
    let qurey = 'SELECT * FROM model_3d WHERE project_id = ?'
    const projectID=req.params.project_id;
    console.log(projectID);
    sql.query(qurey, projectID ,(err, mysqlres) => {
        console.log(mysqlres.length);
   if (err) {
            console.log("error: error: ", err);
            res.status(400).send({message: "could not get files"});
            return;
        };
           console.log('render models');
           res.render('Models', {modellist: mysqlres});
        return;
    })
});


app.get("/FullModel/:url", (req, res) => {
  let modelUrl = req.params.url;
  const encodedModelUrl = encodeURIComponent(modelUrl);
  console.log('the model url');
  console.log(modelUrl);
  let query = "SELECT * FROM note WHERE model_url = ?";
  sql.query(query, modelUrl, (err, results) => {
    if (err) {
      res.status(400).send("error");
      console.log("the error is here");
      console.log(err)
      return;
    }

    res.render('FINALCHECK', { res: results, modelUrl: encodedModelUrl });
    return;
  });
});


app.get("/addNote", (req,res) => {
    res.render('addNote');
});


app.get("/check1/:modelId", (req,res) => {

    res.render('FINALCHECK');
});

app.get("/upload", (req,res) => {
    res.render('Upload');
});

app.get("/pdf", (req,res) => {
    res.render('DocumentPage');
});

app.get("/projects", (req,res) => {
    res.render('Projects');
});


app.get('/ModelDetails', (req, res) => {
  res.render('ModelDetails');
})


app.get('/insertModel' ,(req,res) =>{
    const ModelUrl = req.cookies.model_Url;
    console.log(modelUrl);
    const newUpload = {
        "type": req.body.type,
        "description": req.body.description,
        "url": ModelUrl
    }

    const Q1 = 'INSERT INTO 3d_model SET ?';
    sql.query(Q1, newUpload, (err, mysqlres) => {
         if(err){
            console.log("error : ", err);
            return;
        }
        console.log("created new model:",  { id: mysqlres.insertId});
        res.render('ModelWithNotes' , {
            url: mysqlres[0].url
        });
        return;

    });
});

app.get('/FullNote/:id', (req,res) =>{
    const NoteId= req.params.id;
    sql.query("SELECT * FROM notes where (Id =?)" , [NoteId] , (err, results, fields)=>{
        if(err) {
            res.status(400).send("error");
            return;
        };

         res.render('NotePage', {
            header: results[0].Header,
            content: results[0].Content,
            file: results[0].AddedFile,
            date: results[0].NoteDT


        });
        return;

    });
});

app.post('/addNoteToDB' ,(req,res) =>{
    var corX = 0;
    var corY = 0;
    var corZ = 0;

    if(req.cookies.corX != null){
        corX = req.cookies.corX;
        corY = req.cookies.corY;
        corZ = req.cookies.corZ;
    }
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var creation_dt = date + ' ' + time;
    const newNote = {
        "creation_dt": creation_dt,
        "header": req.body.header,
        "content": req.body.content,
        "cor_x": corX,
        "cor_y": corY,
        "cor_z": corZ,
        "model_url": "https://res.cloudinary.com/dwxlduhe0/image/upload/v1682680100/Final/lomwesrryoaa58xt25op.ply"
    }

    const Q1 = 'INSERT INTO note SET ?';
    sql.query(Q1, newNote, (err, mysqlres) => {
         if(err){
            console.log("error : ", err);
            return;
        }
        console.log("created new note:",  { id: mysqlres.insertId});
        res.render('ModelWithNotes');
        return;

    });
});

//connect to all note in page
app.get("/model1", CRUD.showAllNotes);

//app.get("/Project_Attach", (req,res) => {
//    res.render('Project_Attach');
//});

app.get("/Project_Attach/:project_id", CRUD.Project_Attach);

