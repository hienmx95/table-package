  /* Created by HoangNH40 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const logger = require('morgan');  // log access route

const path = require('path');
const http = require('http');

app.set("PORT", process.env.PORT || 9010 );
app.use(logger('dev'));

// setup CORS
// var whitelist = ['localhost:3060'];

// var optionsCORS = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 ) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS !'), false);
//     }
//   }
// }

app.use(cors());
// app.use('/static', express.static('public'));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.status(404).send('404 - NOT FOUND !');
});


// created Server
const server = http.createServer(app);
server.listen(app.get('PORT'), function () {
    console.log('Server HEADER run on port: ' + app.get('PORT'));
});






