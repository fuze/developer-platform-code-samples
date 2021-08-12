// ----------------------------------------------------------------------------
// DELETE AN AUDIO FILE SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code will delete an audio file stored on a PBX of your 
// organization. Deleted files cannot be recovered.
// 

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
console.log("Delete an audio file by ID\n")
let fileId = Console.getString("File ID")

if (Console.getBoolean('Are you sure', false)) {
  return connector.deleteFilePromise(fileId)
    .then(
      (body) => {
        console.log(JSON.stringify(body.data, null, 2))
      },
      err => {
        HttpErrorHandler.bailOut(err, "file_upload_manage")
      })
} else {
  console.log("Cancelled")
}

// ----------------------------------------------------------------------------
