const sql = require('./db');
let alert = require('alert');
const path = require('path');
const csv=require('csvtojson');
const cookieParser = require('cookie-parser');


const insertNewModel = (req,res) =>{

    const newModel = {
    "file_name": req.body.name,
    "file": req.body.file

    }
    console.log("file:" + req.body.file + req.body.name);
    const Q1 = 'INSERT INTO models SET ?';
    sql.query(Q1, newModel, (err, mysqlres) => {
        if(err){
            console.log("error : ", err);
            alert("Email already exists");
            return;
        }

        res.render('LogIn' ,
            {title:"Log In",
        });
        return;

    })
};

const showAllNotes = (req,res) =>{
    //const ModelId= req.cookies.ModelId;
    // add where modelId= ?
    sql.query("SELECT * FROM notes" ,  (err, results, fields)=>{
        if(err) {
            res.status(400).send("error");
            return;
        };
        if(results.length ==0){
             res.render('SuccessMessage', {
                message: "There are no notes"

            });
            return;
        }

        res.render('ModelWithNotes', {res:results});
        return;
    });
};


const showFullNote = (req,res) =>{
    const note_id= req.cookies.Note_Id;
    sql.query("SELECT * FROM notes where (Id =?)" , [note_id] , (err, results, fields)=>{
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
};

const LogIn = (req, res) => {
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }

    var email = req.body.email;
    var password = req.body.password;

    console.log(email);
    sql.query("SELECT * FROM users where (email =? AND password =?)", [email, password], (err, results, fields) => {
        if (err) {
            console.log("ERROR IS: " + err);
            res.status(400).send("Somthing is wrong with query" + err);
            return;
        }
        if (results.length == 0) {
            alert("Email or Password is incorrect");
            return;
        }

        res.cookie("userId", results[0].id);
        res.cookie("userName", results[0].fname);
        console.log("User found");
        res.render('SuccessMessage', {
            message: 'Welcome ' + results[0].fname + '!'
        });
        return;
    })
};

const insertNewAccount = (req, res) => {
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    const newUser = {
        "email": req.body.email,
        "password": req.body.password,
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "gender": req.body.gender,
        "phone_number": req.body.phone_number,
        "institution": req.body.institution,
        "research_field": req.body.research_field
    }

    const Q1 = 'INSERT INTO user SET ?';
    sql.query(Q1, newUser, (err, mysqlres) => {
        if (err) {
            console.log("error : ", err);
            alert("Email already exists");
            return;
        }
        console.log("created new user:", {id: mysqlres.insertId});
        res.cookie("email", mysqlres[0].email);
        res.render(path.join(__dirname,'../minimal/views/welcomePage'), {name:mysqlres[0].first_name});
        return;

    })
};

const insertNewProject = (req, res) => {
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var creation_dt = date + ' ' + time;

    const user_email = req.cookies.email;
    const newProject = {
        "name": req.body.name,
        "creation_dt": creation_dt,
        "research_field": req.body.research_field,
        "description": req.body.description,
        "user_email": user_email
    }

    const Q1 = 'INSERT INTO project SET ?';
    sql.query(Q1, newProject, (err, mysqlres) => {
        if (err) {
            console.log("error : ", err);
            alert("Project already exists");
            return;
        }
        //res.cookie("project_id", mysqlres[0].id);
        res.render(path.join(__dirname,'../minimal/views/welcomePage'))
        return;
    })};






const checklogin=(req,res)=>{
        if (!req.body) {
            res.status(400).send({message: "content cannot be empty"})
            return;
        }
        const UserData = {
        "email": req.body.username_login,
        "password": req.body.password_login
    }
        console.log(req.body.email);
        const Q1 = 'SELECT * FROM user where email = ? and password= ?';
        sql.query(Q1, [UserData.email, UserData.password], (err, result) => {
            if (err) {
                console.log("error: error: ", err);
                res.status(400).send({message: "could not search"});
                return;
            }
            if (result.length > 0) {
                res.cookie('email',result[0].email)
                console.log('email')
                res.render(path.join(__dirname,'../minimal/views/welcomePage'), {name:result[0].first_name})
            } else {
                res.status(400).send({message:"invalid username or password"});
            }

        }
    )
}

const getFiles =(req,res)=>{
    let qurey = 'SELECT * FROM project WHERE user_email  = ? '
    const email=req.cookies.email;
    sql.query(qurey, email,(err, mysqlres) => {
   if (err) {
            console.log("error: error: ", err);
            res.status(400).send({message: "could not get files"});
            return;
        };

    res.render(path.join(__dirname, '../minimal/views/AllProjects.pug'), {filesList: mysqlres})
        return;
    })
}

const Project_Attach =(req,res)=>{
    //const ModelId= req.cookies.ModelId;
    // add where modelId= ?
    const project_id= req.params.project_id;
    sql.query("SELECT * FROM model_3d WHERE project_id =?" , project_id,  (err, results1, fields)=> {
        if (err) {
            res.status(400).send("error");
            return;
        }
        ;

        sql.query("SELECT * FROM heritage_document WHERE project_id =?" , project_id, (err, results2, fields) => {

            if (err) {
                res.status(400).send("error");
                return;
            }
            ;
            sql.query("SELECT * FROM imagery WHERE project_id =?" , project_id, (err, results3, fields) => {
                if (err) {
                    res.status(400).send("error");
                    return;
                }
                ;
                res.render('Project_Attachments', {
                    modellist: results1,
                    documentlist: results2,
                    imagerylist: results3

                });
                return;
            });

        });
    });
}


    module.exports= {
    insertNewModel,
    showAllNotes,showFullNote,LogIn,insertNewAccount,insertNewProject,getFiles,checklogin,
    Project_Attach};