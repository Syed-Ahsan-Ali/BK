const express=require("express");
var Connection=require("tedious").Connection;
var request=require("tedious").Request;
var config={
  userName:"sa",
  password:"123",
  server:"localhost",
  // database: 'Proposal',
  // instanceName: 'SQLEXPRESS',
  // port:1433
  // // options: {
  //   instanceName: 'MSSQLSERVER',
  //   database: 'Proposal',  //the username above should have granted permissions in order to access this DB.
  //   debug: {
  //     packet: false,
  //     payload: false,
  //     token: false,
  //     data: false
  //   },
  //   //encrypt: true
  // }
};
var connection=new Connection(config);
connection.on("connect",function (err) {
  if(err){
    console.log(err);
  }
  else{
    console.log("success");
  }
});
const app=express();

app.get("/",function (req,res) {
  //var query=connection.query();
  res.send("Sample Responce");
});
app.listen(3000,function () {
  console.log("App is listening at port 3000");
});