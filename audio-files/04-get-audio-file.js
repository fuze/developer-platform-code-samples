// ----------------------------------------------------------------------------
// GET AUDIO FILE BY ID SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code will return the details of an audio file stored on a PBX of 
// your organization.

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
console.log("Get audio file by ID\n")
let fileId = Console.getString("File ID")

return connector.getFilePromise(fileId)
  .then(
    (body) => {
      console.log(JSON.stringify(body.data, null, 2))
    },
    err => {
      HttpErrorHandler.bailOut(err, "file_upload_read")
    })
// ----------------------------------------------------------------------------
