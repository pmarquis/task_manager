var http = require('http');
var redis = require('redis');
var express = require('express');
var jquery = require('jquery');
app = express();
server = http.createServer(app);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('./public/index.html');
});

var redisClient = redis.createClient();
redisClient.on("connect", function(){
  console.log("Redis connected");
});

app.get('/delete/:id', function(req, res){
  var id = req.params.id;
  console.log('delete index ' + req.params.id);
    
  redisClient.lrange('objectives', 0, -1, function(error, objectives){
    if(error){
      console.error("Failed to delete objective " + id + ": " + error);
    }
    else if(objectives){
      for(var i=0; i<objectives.length; i++){
        // var obj = JSON.parse(objectives[i]);
        if(i == id){
          redisClient.lrem('objectives', req.params.id, objectives[i], function(error, response){
            if(error){
              console.error("Failed to delete objective " + id + ": " + error);
              res.send(error);
            }
            else{
              res.send('OK: ' + response);      
            }
          });
        }
      }
    }      
  });
});

app.get('/data.json', function(req, res){
  var data = [];
  redisClient.lrange('objectives', 0, -1, function(error, objectives){
    if(error){
      console.error(error);
    }
    else if(objectives){
      for(var i=0; i<objectives.length; i++){
        var obj = JSON.parse(objectives[i]);
        obj['id'] = i;
        data.push(obj);
      }
    }
    res.send(data);
  });
  console.log("retrieved data: " + data);
//   var data = [
//   {
//     title: "Démarrer le site d'objectifs",
//     description: "Editer. Afficher différents type d'objectif",
//     time: "2h",
//     period: "day"
//   }
//   ];
});

app.get('/insert/:title/:description/:time/:period', function(req, res){
  var data = JSON.stringify({
                              title: req.params.title,
                              description: req.params.description,
                              time: req.params.time,
                              period: req.params.period
                            });
  console.log("insert data: " + data);

  redisClient.lpush('objectives', data, function(error, reply){
    if(error){
      console.log(error);
    }
    else{
      console.log("Data inserted: " + reply);
    }
  });

  // Check values
  console.log('get data');
  redisClient.lrange('objectives', 0, -1, function(error, objectives){
    console.log(error);
    console.log(objectives);
    for(var i; i<objectives.length; i++){
      var json = JSON.stringify(eval("(" + reply + ")"));
      data.push(json);  
    }
  });

  res.send(data);
});

app.get('/delete/:title', function(req, res){
  // delete data from redis DB
  res.send(data);
});


app.listen(8080);
