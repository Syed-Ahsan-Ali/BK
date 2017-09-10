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
      });
      request.on("done",function (rowCount,more) {
        console.log(rowCount+"rows Returned")
      });
      connection.execSql(request);
    }
  });
}
function getDescById(Id,callback) {
  var connection=new Connection(config);
  var descData=[];
  connection.on("connect",function (err) {
    if(err)
    {
      console.log(err);
    }
    else
    {
      var request=new Request("select d.screenText from Description as d\n" +
        "\tinner join tagDescription as td on d.Id=td.descriptionId\n" +
        "\tinner join tags as t on t.Id=td.tagId\n" +
        "\twhere t.Id="+Id+"\n" +
        "\t",function (err,rowCount) {
        if(err)
        {
          callback(err);
        }
        else if(rowCount<1)
        {
          callback(null,false);
        }
        else {
          callback(null,descData);
        }
      });
      request.on("row",function (columns) {
        descData.push({screenText:columns[0].value});
      });
      connection.execSql(request);
    }
  })
}
function getDescByType(type,callback) {
  var connection=new Connection(config);
  var descData=[];
  connection.on("connect",function (err) {
    if(err)
    {
      console.log(err);
    }
    else
    {
      var request=new Request("select d.screenText from Description as d where d.type='"+type+"'",function (err,rowCount) {
        if(err)
        {
          callback(err);
        }
        else if(rowCount<1)
        {
          callback(null,false);
        }
        else {
          callback(null,descData);
        }
      });
      request.on("row",function (columns) {
        descData.push({screenText:columns[0].value});
      });
      connection.execSql(request);
    }
  })
}
function getDescByIDAndType(Id,type,callback) {
  var connection=new Connection(config);
  var descData=[];
  connection.on("connect",function (err) {
    if(err)
    {
      console.log(err);
    }
    else
    {
      var request=new Request("select d.screenText from Description as d " +
        "inner join tagDescription as td on d.Id=td.descriptionId" +
        " inner join tags as t on t.Id=td.tagId" +
        " where t.Id="+Id+" and d.type='"+type+"'",function (err,rowCount) {
        if(err)
        {
          callback(err);
        }
        else if(rowCount<1)
        {
          callback(null,false);
        }
        else {
          callback(null,descData);
        }
      });
      request.on("row",function (columns) {
        descData.push({screenText:columns[0].value});
      });
      connection.execSql(request);
    }
  })
}
const app=express();
app.get("/tags",function (req,res) {
  getTags(function(err,rows){
  if(err){
    res.send(err);
  }
  else if(rows){
    res.send(rows);  }
  else{
    res.send("No Data Available");
  }
  });

});
app.get("/tags/:Id",function (req,res) {
  var Id=req.params.Id;
  getDescById(Id,function (err,rows) {
    if(err)
    {
      res.send(err);
    }
    else if(rows)
    {
      res.send(rows)
    }
    else{
      res.send("No Data Available");
    }
  })
});
app.get("/tags/type/:type",function (req,res) {
  var type=req.params.type;
  getDescByType(type,function (err,rows) {
    if(err){
      res.send(err);
    }
    else if(rows){
      res.send(rows);
    }
    else{
      res.send("No Data Available")
    }
  })
});
app.get("/tags/:Id/:type",function (req,res) {
  var type=req.params.type;
  var Id=req.params.Id;
  getDescByIDAndType(Id,type,function (err,rows) {
    if(err){
      res.send(err);
    }
    else if(rows){
      res.send(rows);
    }
    else{
      res.send("No Data Available")
    }
  })
});

app.listen(3000,function () {
  console.log("App is listening at port 3000");
});