const express = require("express");
const mysql = require("mysql");
// const con = require("./connection");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "form_data",
});

//connection to MySql
con.connect(function (error) {
  if (error)  console.log(error + " Not connected....");
  console.log("MySql is connected...");
});

//get data from MySql
con.query("select * from registration", function (err, res) {
  if (err) throw err;
  console.log(res);
});

app.get("/register", function (req, res) {
  res.sendFile(__dirname + "/register.html");
});
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.post("/register", function (req, res) {
  const First_Name = req.body.First_Name;
  const Last_Name = req.body.Last_Name;
  const Email = req.body.Email;
  const Password = req.body.Password;

  // con.connect(function (error) {
  //   if (error) throw console.log(error + " Not connected....");
  //   // console.log("MySql is connected...");
  // });

  var sql =
    "INSERT INTO registration(First_Name, Last_Name,Email,Password) VALUES('" +
    First_Name +
    "','" +
    Last_Name +
    "','" +
    Email +
    "','" +
    Password +
    "')";

  con.query(sql, function (error, result) {
    if (error) throw error;
    res.send("Student register successful" + result.insertId);
  });
});

app.listen(7000);
