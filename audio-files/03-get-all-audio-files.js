// ----------------------------------------------------------------------------
// GET ALL AUDIO FILES SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code will list all audio files currently uploaded to PBXs of 
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
let pageCounter = 0;
let nbrAudioFiles = 0;

// ----------------------------------------------------------------------------
// Recursively get pages of audio files from the API.
// This function returns a promise with the total number of audio files.
// ----------------------------------------------------------------------------
function getAllAudioFilesPromise(searchParamsDict, cursor) {
  return connector.listAllFilesPromise(searchParamsDict, cursor)
    .catch(err => HttpErrorHandler.bailOut(err, "file_upload_read"))
    .then(body => {
      console.log("\nPage " + (++pageCounter) + " with " + body.data.length + " items");

      body.data.forEach(audioFile => {
        console.log(" audio file " + audioFile.id + " filename=" + audioFile.name + "." + audioFile.extension + " duration=" + audioFile.duration + "ms")
      });

      nbrAudioFiles += body.data.length

      if (body.pagination.cursor != null) {
        return getAllAudioFilesPromise(searchParamsDict, body.pagination.cursor)
      } else {
        return Promise.resolve(nbrAudioFiles)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
console.log("List all audio files\nAll parameters are optional\n")
let searchParams = {};

let optionalPbx = Console.getString("PBX (leave empty to ignore)")
searchParams.pbx = Console.trimToNull(optionalPbx);

let optionalName = Console.getString("Name (leave empty to ignore)")
searchParams.name = Console.trimToNull(optionalName);

let optionalCategory = Console.getString("Category (GREETING, HOLD, HOURS, PROMOTION, HOLIDAY, ANNOUNCEMENT, LOCATION or empty to ignore)");
searchParams.category = Console.trimToNull(optionalCategory);

let optionalSortBy = Console.getString("Sort by (pbx, name, id, category, modified, duration or empty for default (id))");
searchParams.sortBy = Console.trimToNull(optionalSortBy);

let optionalOrder = Console.getString("Order (asc, desc or empty for default (asc))");
searchParams.order = Console.trimToNull(optionalOrder);

getAllAudioFilesPromise(searchParams, null)
  .then(totalAudioFilesFound => console.log("Found a total of " + totalAudioFilesFound + " audio files"))
// ----------------------------------------------------------------------------
