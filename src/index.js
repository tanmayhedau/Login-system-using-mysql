const express = require("express");
const mysql = require("mysql");
const rateLimit = require("express-rate-limit");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  message:
    "Too many requests made from this IP, please try again after 24 hrs",
  standardHeaders: true,
  legacyHeaders: false,
});   

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "form_data",
});

//connection to MySql
con.connect(function (error) {
  if (error) console.log(error + " Not connected....");
  console.log("MySql is connected...");
});

//get data from MySql
con.query("select * from registration", function (error, result) {
  if (error) throw console.log(error);
  console.log(result);
});

app.get("/register", function (req, res) {
  res.sendFile(__dirname + "/register.html");
});
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});
app.get("/dashboard", function (req, res) {
  res.sendFile(__dirname + "/dashboard.html");
});
app.get("/success", function (req, res) {
  res.sendFile(__dirname + "/success.html");
});

app.post("/register", function (req, res) {
  const First_Name = req.body.First_Name;
  const Last_Name = req.body.Last_Name;
  const Email = req.body.Email;
  const Password = req.body.Password;

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
    if (error) throw console.log(error);
    res.redirect("/success");
  });
}); 

app.post("/login", limiter, function (req, res) {
  let email = req.body.Email;
  let password = req.body.Password;

  con.query(
    "select * from registration where Email = ? and Password = ?",
    [email, password],
    function (error, results, fields) {
      if (results.length > 0) {
        res.redirect("/dashboard");
      } else {
        res.send("Invalid credentials");
      }
    }
  );
});

app.listen(7000);
  