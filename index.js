const express=require("express");
var Tags=require("./Models/Tags");
var Connection=require("tedious").Connection;
var config={
  userName:"sa",
  password:"123",
  server:"localhost",
  options:{
    instanceName:"SQLEXPRESS",
    database:"Proposal"
  }
};

var Request=require("tedious").Request;
function getTags(callback){
  var connection=new Connection(config);
  var newdata=[];
  connection.on("connect",function (err) {
    if(err) {
      console.log("Not Connected"+err);
    }else {
      var request=new Request("select *from tags;",function (err,rowCount) {
        if(err)
        {
          callback(err);
        }
        else
        {
          if(rowCount<1)
          {
            callback(null,false);
          }
          else{
            callback(null,newdata);
          }
        }
      });
      process.setMaxListeners(0);
      request.on("row", function (columns) {
        newdata.push({Id:columns[0].value,screenName:columns[1].value});
        //console.log(JSON.stringify(columns));
        // columns.forEach(function (column) {
        //   //console.log(JSON.stringify(column));
        //   newdata.push({val:column.value});
        // });
      });
      request.on("done",function (rowCount,more) {
        console.log(rowCount+"rows Returned")
      });
      connection.execSql(request);
    }
  });


}
const app=express();
app.get("/tags",function (req,res) {
  getTags(function(err,rows){
  if(err){
    console.log(err);
  }
  else if(rows){
    res.send(rows);  }
  else{
    console.log("No Data Available");
  }
  });

});
app.listen(3000,function () {
  console.log("App is listening at port 3000");
});