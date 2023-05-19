var SQL = require('./db');
const path = require('path');
const csv = require('csvtojson');


const CreateUsersTable = (req,res,next)=> {
    var Q1 = "CREATE TABLE IF NOT EXISTS users (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, email varchar(30) NOT NULL UNIQUE ,fname varchar(25) NOT NULL,lname varchar(30) NOT NULL,password varchar(20) NOT NULL,age int NOT NULL,phone varchar(20) NOT NULL)";
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating table"});
            return;
        }
        console.log('created users table');

        return;
    })
    next();
};

const CreateCosmeticiansTable = (req,res,next)=> {
    var Q2 = "CREATE TABLE IF NOT EXISTS Cosmeticians (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, email varchar(30) NOT NULL UNIQUE,fname varchar(25) NOT NULL,lname varchar(30) NOT NULL,phone varchar(20) NOT NULL,address varchar(100) NOT NULL,city varchar(100) NOT NULL,about varchar(1000) NOT NULL,cost int NOT NULL,Years_Of_Exp int NOT NULL,instagram varchar(70) NOT NULL)";
    SQL.query(Q2, (err, mySQLres) => {
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating table"});
            return;
        }
        console.log('created Cosmeticians table');

        return;
    })
    next();
};


const CreateAppointmentsTable = (req,res,next)=> {
      var Q4 = "CREATE TABLE IF NOT EXISTS Appointments(id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, cosmetician_id int NOT NULL,cosmetician_name varchar(25) NOT NULL,date date NOT NULL,time time NOT NULL,city varchar(100) NOT NULL, cost int NOT NULL)";
    SQL.query(Q4,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating table"});
            return;
        }
        console.log('created Appointments table');
        return;
    })
    next();
};

const CreateReviwesTable = (req,res)=> {
      var Q3 = "CREATE TABLE IF NOT EXISTS Reviews(id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,cosmetician_id int NOT NULL,user_id int NOT NULL,date date NOT NULL,review varchar(500) NOT NULL,rating int NOT NULL)";
    SQL.query(Q3,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating table"});
            return;
        }
        console.log('created Reviews table');
        res.send("created all tables successfully");
        return;
    })
};

const CreateModelsTable = (req,res)=> {
      var Q3 = "create table Models (file_name varchar(20),file MEDIUMBLOB)";
    SQL.query(Q3,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating table"});
            return;
        }
        console.log('created Reviews table');
        res.send("created all tables successfully");
        return;
    })
};

const InsertUsersData = (req,res,next)=> {
    var Q5 = "INSERT INTO users SET ?";
    const csvFilePath = path.join(__dirname, "users_data.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj);
            jsonObj.forEach(element => {
                var NewEntry = {
                    "email": element.email,
                    "fname": element.fname,
                    "lname": element.lname,
                    "password": element.password,
                    "age": element.age,
                    "phone": element.phone
                }
                SQL.query(Q5, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting users_data", err);
                    }
                    console.log("created row in users table successfully ");
                });
            });
        })
        next();
};

const InsertCosmeticiansData = (req,res,next)=> {
    var Q6 = "INSERT INTO Cosmeticians SET ?";
    const csvFilePath = path.join(__dirname, "cosmeticians_data.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj);
            jsonObj.forEach(element => {
                var NewEntry = {
                    "email": element.email,
                    "fname": element.fname,
                    "lname": element.lname,
                    "phone": element.phone,
                    "address": element.address,
                    "city": element.city,
                    "about": element.about,
                    "cost": element.cost,
                    "Years_Of_Exp": element.Years_Of_Exp,
                    "instagram": element.instagram
                }
                SQL.query(Q6, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting cosmeticians_data", err);
                    }
                    console.log("created row in cosmeticians table successfully ");
                });
            });
        });
        next();
};

const InsertReviewsData = (req,res,next)=> {
    var Q7 = "INSERT INTO Reviews SET ?";
    const csvFilePath = path.join(__dirname, "Reviews_data.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj);
            jsonObj.forEach(element => {
                var NewEntry = {
                    "id": element.id,
                    "cosmetician_id": element.cosmetician_id,
                    "user_id": element.user_id,
                    "date": element.date,
                    "review": element.review,
                    "rating": element.rating
                }
                SQL.query(Q7, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting users_data", err);
                    }
                    console.log("created row in Reviews table successfully ");
                });
            });
        });
        next();
};

const InsertAppointmentsData = (req,res)=> {
    var Q8 = "INSERT INTO Appointments SET ?";
    const csvFilePath= path.join(__dirname, "Appointments_data.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewEntry = {
            "id": element.id,

            "cosmetician_id": element.cosmetician_id,
            "cosmetician_name": element.cosmetician_name,
            "date": element.date,
            "time": element.time,
            "city": element.city,
            "cost": element.cost,
        }
        SQL.query(Q8, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting Appointments_data", err);
            }
            console.log("created row in Appointments table successfully ");
        });
    });
    });
    res.send("inserted data to all tables successfully");
};

const ShowUsersTable = (req,res,next)=>{
    var Q9 = "SELECT * FROM users";
    SQL.query(Q9, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing users table ", err);
            res.send("error in showing users table ");
            return;
        }
        console.log("showing users table");
        res.send(mySQLres);
        next();

    })
};

const ShowCosmeticiansTable = (req,res)=>{
    var Q10 = "SELECT * FROM Cosmeticians";
    SQL.query(Q10, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing Cosmeticians table ", err);
            res.send("error in showing Cosmeticians table ");
            return;
        }
        console.log("showing Cosmeticians table");
        res.send(mySQLres);

    })
};

const ShowReviewsTable = (req,res,next)=>{
    var Q11 = "SELECT * FROM Reviews";
    SQL.query(Q11, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing Reviews table ", err);
            res.send("error in showing Reviews table ");
            return;
        }
        console.log("showing Reviews table");
        res.send(mySQLres);
        next();

    })
};

const ShowAppointmentsTable = (req,res)=> {
    var Q12 = "SELECT * FROM Appointments";
    SQL.query(Q12, (err, mySQLres) => {
        if (err) {
            console.log("error in showing Appointments table ", err);
            res.send("error in showing Appointments table ");
            return;
        }
        console.log("showing Appointments table");
        res.send(mySQLres);
        return;
    })
};

const DropUsersTable = (req, res, next)=> {
    var Q13 = "DROP TABLE users";
    SQL.query(Q13, (err, mySQLres) => {
        if (err) {
            console.log("error in droping users table ", err);
            res.status(400).send({message: "error in dropping users table" + err});
            return;
        }
        console.log("table users dropped");

        next();
    })
};

const DropCosmeticiansTable = (req, res, next)=> {
    var Q14 = "DROP TABLE Cosmeticians";
    SQL.query(Q14, (err, mySQLres) => {
        if (err) {
            console.log("error in droping Cosmeticians table ", err);
            res.status(400).send({message: "error in dropping Cosmeticians table" + err});
            return;
        }
        console.log("table Cosmeticians dropped");

        next();
    })
};

const DropReviewsTable = (req, res, next)=> {
    var Q15 = "DROP TABLE Reviews";
    SQL.query(Q15, (err, mySQLres) => {
        if (err) {
            console.log("error in droping Reviews table ", err);
            res.status(400).send({message: "error in dropping Reviews table" + err});
            return;
        }
        console.log("table Reviews dropped");

        next();
    })
};

const DropAppointmentsTable = (req, res)=>{
    var Q16 = "DROP TABLE Appointments";
    SQL.query(Q16, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping Appointments table ", err);
            res.status(400).send({message: "error in dropping Appointments table" + err});
            return;
        }
        console.log("table Appointments dropped");
        res.send("all tables were dropped");
        return;
    })
};


module.exports = {
    CreateUsersTable,
    CreateCosmeticiansTable,
    CreateAppointmentsTable,
    CreateReviwesTable,
    InsertUsersData,
    InsertCosmeticiansData,
    InsertReviewsData,
    InsertAppointmentsData,
    ShowUsersTable,
    ShowCosmeticiansTable,
    ShowReviewsTable,
    ShowAppointmentsTable,
    DropUsersTable,
    DropCosmeticiansTable,
    DropReviewsTable,
    DropAppointmentsTable,
CreateModelsTable};
