import { ipcMain } from 'electron'
import BrowserWinHandler from './BrowserWinHandler'
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const yauzl = require('yauzl')

const winHandler = new BrowserWinHandler({
  height: 600,
  width: 1000,
  autoHideMenuBar: true
})

winHandler.onCreated(_browserWindow => {
  winHandler.loadPage('/')
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

ipcMain.on('downloadFile', function (event, data) {
  const filePath = data.filePath
  const item = data.item

  console.log('Downloading file to ' + filePath)

  axios({
    method: 'GET',
    url: item.downloadURL,
    responseType: 'stream'
  }).then(response => {
    response.data.pipe(fs.createWriteStream(filePath))
    const totalSize = response.headers['content-length']
    let downloaded = 0
    response.data.on('data', data => {
      downloaded += Buffer.byteLength(data)
      event.sender.send('downloadProgress', { total: totalSize, loaded: downloaded })
    })
    response.data.on('end', () => {
      event.sender.send('downloadEnd')
    })
    response.data.on('error', error => {
      event.sender.send('downloadError', error)
    })
  }).catch(error => {
    event.sender.send('downloadError', error)
  })
})

ipcMain.on('installGame', function (event, data) {
  if (!fs.existsSync(data.installDirPathBase)) {
    try {
      fs.mkdirSync(data.installDirPathBase, { recursive: true })
    } catch (error) {
      console.log(`Could not create the install folder at ${data.installDirPathBase}`)
      console.log(error)
      throw error
    }
  }

  yauzl.open(data.filePath, function (err, zipfile) {
    if (err) throw err
    zipfile.on('error', function (error) {
      event.sender.send('installError', error)
    })
    zipfile.on('entry', function (entry) {
      // console.log(entry)
      // console.log(entry.getLastModDate())
      console.log(entry.fileName)
      zipfile.openReadStream(entry, function (error, readStream) {
        if (error) {
          event.sender.send('installError', error)
        } else {
          const filePath = data.installDirPathBase + data.identifier + '/' + entry.fileName
          const dirname = path.dirname(filePath)
          console.log(JSON.stringify({ filePath, dirname }))
          if (!entry.fileName.endsWith('/')) {
            // it's a file, not a directory
            if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true })
            console.log('Unzipping to ' + filePath)
            try {
              readStream.pipe(fs.createWriteStream(filePath))
            } catch (error) {
              console.log(error)
            }
          } else if (!fs.existsSync(filePath)) {
            // just create the directory
            fs.mkdirSync(filePath, { recursive: true })
          }
        }
      })
    })
    zipfile.on('close', function () {
      console.log('Installed.')
      event.sender.send('installEnd')
    })
  })
})

export default winHandler
