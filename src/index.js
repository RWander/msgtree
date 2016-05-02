'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let config = require('config');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
