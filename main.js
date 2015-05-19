var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var glob = require('glob');
var ipc = require('ipc');
var fs = require('fs');
var Presentation = require('./presentation.js')
var Slide = require('./slide.js')
var util = require('./util.js')

var mainWindow = null;
var editWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

var presentations = [];

ipc.on('loadFiles', function(event, args){
  var files = glob.sync(__dirname + '/*.md');

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var parsed = util.parseFile(file)
    var p = new Presentation(parsed.slides, parsed.presentationCfg)
    p.render();
    presentations.push(p);
  };

  event.returnValue = presentations;
});


ipc.on('loadFile', function(event, fileName){

    var parsed = util.parseFile(fileName);
    var p = new Presentation(parsed.slides, parsed.presentationCfg)
    p.render();

    event.returnValue = p;
});


ipc.on('editPresentation', function(event, presentationFile){
  editWindow = new BrowserWindow({width: 800, height: 600});
  editWindow.loadUrl('file://' + __dirname + '/edit.html?file=' + presentationFile);
  editWindow.openDevTools();

  editWindow.on('closed', function() {
    editWindow = null;
  });
});

