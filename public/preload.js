const { ipcRenderer, remote, clipboard, shell,dialog } = require('electron')
const fs = require('fs')
const path = require('path')
const process = require('process');

window.utils = {
  clipboard: {
    writeText: (text) => {
      clipboard.writeText(text)
    }
  },
  showDialog: (type,title,message,buttons,callback) => {
    dialog.showMessageBox({
    type: type,
    title: title,
    message: message,
    buttons: buttons
	},callback);
  },
  showOpenDialog: (name='文件',extensions=[]) => {
    return dialog.showOpenDialog(remote.getCurrentWindow(), { filters: [{ 'name': name, extensions: extensions }], properties: ['openFile'] })
  },
  showMssage:(text,title='utools')=>{
	notifier.notify(
     {
       title: title,
       subtitle: 'utools',
       message: text,
       sound: true,
       wait: true
     },
     function (err, response) {
       if (err) {
         console.log(err)
       }
     }
   )
  },
  openExternal: shell.openExternal,
  readFile:(pathObj)=>{
	  var bitmap = fs.readFileSync(pathObj.path);
	  var file = new File(bitmap,pathObj.name);
	  console.log("readFile",bitmap,file)
	  return file;
  },
  openDefaultBrowser: function (url) {
    var exec = require('child_process').exec;
    switch (process.platform) {
      case "darwin":
        exec('open ' + url);
        break;
      case "win32":
        exec('start ' + url);
        break;
      default:
        exec('xdg-open', [url]);
    }
  }
}

window.db = function(name,value=undefined){
    console.log(utools,utools.db);
    let obj = utools.db.get(name);
    if (value !== undefined){
        let putdata = {
            _id: name,
            data: value,
        }
        if (obj && obj._rev){
            putdata._rev = obj._rev;
        }
        utools.db.put(putdata)
        return;
    }
    if (obj == null) return null;
    return obj.data;
}

window.is_utools = true;
