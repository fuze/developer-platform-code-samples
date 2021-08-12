// ----------------------------------------------------------------------------
// FIND WHERE AN AUDIO FILE IS BEING USED SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code will help you determine where an audio file stored on a 
// PBX of your organization is currently being used.
// 
// Audio files can be used in Call flows, Queues and Menus

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
const config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const AudioFilesConnector = require('../connectors/AudioFilesConnector.js')
const Console = require('../utils/Console')
const HttpErrorHandler = require('../utils/Errors.js')

const connector = new AudioFilesConnector(config)


// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
console.log("Find where an audio file is being used\n")
let fileId = Console.getString("File ID")

return connector.getFileUsesPromise(fileId)
  .then(
    (body) => {
      console.log(JSON.stringify(body.data, null, 2))
    },
    err => {
      HttpErrorHandler.bailOut(err, "file_upload_read")
    })
// ----------------------------------------------------------------------------
