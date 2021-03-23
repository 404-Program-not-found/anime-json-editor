const {app, BrowserWindow} = require('electron');
const {dialog} = require('electron');
const {ipcMain} = require('electron');
const {Menu} = require('electron');
const {basename} = require('path')
const path = require('path');
const fs = require('fs');
let win = null

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  return mainWindow
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
  win = createWindow()

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open File',
          click: function(){
            dialog.showOpenDialog(
              {
              properties: ['openFile'],
              filters:[
                {name:"JSON files", extensions:["json"]}
              ] 
              }).then(result => {
                if (result.canceled === false) {
                  fs.readFile(result.filePaths[0], (err, data) => {
                  if (!err) {
                    win.webContents.send('print-file', [data.toString(), basename(result.filePaths[0])])
                    }
                  })
                } 
              }).catch(err => {
                console.log(err)
              });
          }
        },
        {
          label: 'Save'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo'
        },
        {
          label: 'Redo'
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    win = createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
