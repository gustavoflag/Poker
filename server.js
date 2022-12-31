const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const routes = require('./api/routes');
const port = process.env.PORT || 3000;
const jsonwebtoken = require("jsonwebtoken");
const bodyParser = require('body-parser');

//Connect to DataBase
const dbConnection = require('./api/mongoose');
dbConnection.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT'){
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode){
      if (err)
        req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

/*SERVER*/
routes(router);
app.use('/.netlify/functions/server', router);
module.exports.handler = serverless(app);

/*LOCAL*/
// routes(app);
// app.listen(port);
// console.log('API iniciada, porta: ' + port);
