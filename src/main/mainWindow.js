import { ipcMain } from 'electron'
import BrowserWinHandler from './BrowserWinHandler'
const fs = require('fs')
const path = require('path')
import axios from 'axios'
import yauzl from 'yauzl'

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
    const writer = fs.createWriteStream(filePath)
    response.data.pipe(writer)

    const totalSize = response.headers['content-length']
    let downloaded = 0

    response.data.on('data', data => {
      downloaded += Buffer.byteLength(data)
      event.sender.send('downloadProgress', { total: totalSize, loaded: downloaded })
    })

    writer.on('finish', () => {
      console.log('Download finished and file saved.')
      event.sender.send('downloadEnd')
    })

    writer.on('error', error => {
      console.error('Writer error:', error)
      event.sender.send('downloadError', error)
    })

    response.data.on('error', error => {
      console.error('Response stream error:', error)
      event.sender.send('downloadError', error)
    })
  }).catch(error => {
    console.error('Axios error:', error)
    event.sender.send('downloadError', error)
  })
})

ipcMain.on('installGame', function (event, data) {
  console.log('Installing game: ' + data.identifier)
  if (!fs.existsSync(data.installDirPathBase)) {
    try {
      fs.mkdirSync(data.installDirPathBase, { recursive: true })
    } catch (error) {
      console.log(`Could not create the install folder at ${data.installDirPathBase}`)
      console.log(error)
      throw error
    }
  }

  yauzl.open(data.filePath, { lazyEntries: true }, function (err, zipfile) {
    if (err) {
      console.error('Yauzl open error:', err)
      event.sender.send('installError', err)
      return
    }

    let entriesHandled = 0
    let entriesFinished = 0
    let isClosed = false

    const checkFinished = () => {
      if (isClosed && entriesFinished === entriesHandled) {
        console.log('Installation fully complete.')
        event.sender.send('installEnd')
      }
    }

    zipfile.readEntry()

    zipfile.on('entry', function (entry) {
      entriesHandled++
      const filePath = path.join(data.installDirPathBase, data.identifier, entry.fileName)
      const dirname = path.dirname(filePath)

      if (/\/$/.test(entry.fileName)) {
        // Directory
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true })
        entriesFinished++
        zipfile.readEntry()
      } else {
        // File
        if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true })
        zipfile.openReadStream(entry, function (error, readStream) {
          if (error) {
            console.error('ReadStream error:', error)
            event.sender.send('installError', error)
            return
          }
          const writer = fs.createWriteStream(filePath)
          readStream.pipe(writer)
          writer.on('finish', () => {
            entriesFinished++
            zipfile.readEntry()
            checkFinished()
          })
          writer.on('error', (err) => {
            console.error('Unzip writer error:', err)
            event.sender.send('installError', err)
          })
        })
      }
    })

    zipfile.on('error', function (error) {
      console.error('Zipfile error:', error)
      event.sender.send('installError', error)
    })

    zipfile.on('close', function () {
      isClosed = true
      console.log('Zip file closed. Waiting for finish...')
      checkFinished()
    })
  })
})

export default winHandler
