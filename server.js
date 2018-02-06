/**
 * Project Name: ha-cunkute
 * Description: Home Assistant with WebSocket by Keite Tran
 * Creator: Tran Ngoc Anh - VietVbb Team (Keite)
 * Email: mr.ngocanhtran.com@gmail.com
 * HomePage: https://facebook.com/mr.ngocanhtran
 */


// Setup app icon
// -------------------------------------
const express = require("express");
const path = require('path');
const app = express();

// Setup app icon
// -------------------------------------
app.set('views', path.join(__dirname, 'dist'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Setup app icon
// -------------------------------------
app.use('/favicon.ico', express.static(path.join(__dirname, 'dist/favicon.ico')));
app.use('/manifest.json', express.static(path.join(__dirname, 'dist/manifest.json')));
app.use('/android-touch-icon-192x192.png', express.static(path.join(__dirname, 'dist/android-touch-icon-192x192.png')));

// Apple devices
// -------------------------------------
app.use('/apple-touch-icon.png', express.static(path.join(__dirname, 'dist/apple-touch-icon.png')));
app.use('/apple-touch-icon-152x152.png', express.static(path.join(__dirname, 'dist/apple-touch-icon-152x152.png')));
app.use('/apple-touch-icon-167x167.png', express.static(path.join(__dirname, 'dist/apple-touch-icon-167x167.png')));
app.use('/apple-touch-icon-180x180.png', express.static(path.join(__dirname, 'dist/apple-touch-icon-180x180.png')));
app.use('/apple-touch-startup-image-750×1294.png', express.static(path.join(__dirname, 'dist/apple-touch-startup-image-750×1294.png')));

// Public assets folder
// -------------------------------------
app.use('/assets', express.static(path.join(__dirname, 'dist/assets')));

//It will find and locate index.html from View or Scripts
// -------------------------------------
app.get('/', function (req, res) {
	res.render('./index.html');
});

// Setup port running
// -------------------------------------
app.listen(3001);
console.log("Running at Port 3001");