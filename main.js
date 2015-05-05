var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var glob = require('glob');
var ipc = require('ipc');
var fs = require('fs');
var marked = require('marked');


marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
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

ipc.on('editPresentation', function(event, args){
  editWindow = new BrowserWindow({width: 800, height: 600});
  editWindow.loadUrl('file://' + __dirname + '/present.html');
  editWindow.openDevTools();

  editWindow.on('closed', function() {
    editWindow = null;
  });
});

ipc.on('loadFiles', function(event, args){
  var res = [];
  var files = glob.sync(__dirname + '/*.md');

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var data = fs.readFileSync(file, {encoding: 'utf8'});
    var slides = data.split('---');
    res.push({
      "fileName": file.substring(file.lastIndexOf("/")).replace("/", ""),
      "slides": slides
    });
  };

  event.returnValue = res;
});

ipc.on('renderSlide', function(event, md){
  event.returnValue = marked(md);
});
