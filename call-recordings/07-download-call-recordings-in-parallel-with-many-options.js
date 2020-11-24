// ----------------------------------------------------------------------------
// DOWNLOAD ALL CALL RECORDINGS (7)
// ----------------------------------------------------------------------------
// This sample code retrieves call recordings available on your organization,
// filtering by date range and with a cursor option if you need to stop it and
// restart it at the same position it was when you stopped it.
//
// The script will download the audio and the json metadata to files.
// These files are places them in an hierarchical tree, by year/month/day/hour:
// + yearUTC
//   + monthUTC
//     + dayUTC
//       + hourUTC
//         123456789.wav
//         123456789.json
//         555555555.wav
//         555555555.json
//
// It's strongly encouraged to run this script with date ranges. Doing so will
// let you run multiple instances of the script and parallelize/accelerate the
// download of the call recordings.
//
// A good idea is to use a date range of 1 month and start multiple instances
// of the script at the same time, each with a different month, to download
// the audio of these months in parallel.
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies (httplease and node-stringbuilder)
// ----------------------------------------------------------------------------
var fs = require('fs')
const StringBuilder = require('node-stringbuilder')
const httplease = require("httplease");
const CallRecordingsConnector = require('../connectors/CallRecordingsConnector')
const HttpErrorHandler = require('../utils/Errors.js')

var pmap = require('p-map');
var connector = new CallRecordingsConnector(config)
var pageCounter = 0;

// ----------------------------------------------------------------------------
// Download recordings sequentially
// ----------------------------------------------------------------------------
var pmap = require('p-map');
async function downloadCallRecordings(calls) {
    var downloadCounter = 0;
    return pmap(
        calls,
        (cr) => {
            var date = new Date(Date.parse(cr.startedAt))
            var dir = folderName + "/" + date.getUTCFullYear() + "/" + (date.getUTCMonth()+1) + "/" + date.getUTCDate() + "/" + date.getUTCHours();
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }
            var json = JSON.stringify(cr, null, 4);
            fs.writeFile(dir + "/" + cr.recordingId + ".json", json, (err) => {
                if (err) throw err;
            });
            var file = dir + "/" + cr.recordingId + ".wav"
            if (!fs.existsSync(file)) {
                console.log(" Download call recording id: " + cr.recordingId)
                return connector
                    .downloadCallRecPromise(cr.recordingId, (response) => response.pipe(fs.createWriteStream(file)))
                    .catch(err => {
                        console.error("Failed to download call recording with id " + cr.recordingId + ": " + err.message)
                        HttpErrorHandler.showPrettyError(err, "callrecordings_read")
                    })
                    .then(x => {
                      downloadCounter++;
                      console.log(" Downloaded " + file + " - " + downloadCounter)
                    })
            } else {
                console.log(" Download call recording id: " + cr.recordingId + " NOT needed, file already exists")
                return Promise.resolve()
            }
        },
        {concurrency: 16}
    );
}

// ----------------------------------------------------------------------------
// Recursively get pages of call recordings from the API.
// This function returns a promise with all the call recording IDs.
// ----------------------------------------------------------------------------
function getTotalCallRecordingsPromise(cursor, optionalAfter, optionalBefore) {
    console.log("\nGet page " + (++pageCounter) + " of call recordings from " + optionalAfter + ", to " + optionalBefore + " with cursor " + cursor);

    return connector.getAllCallRecsPromise(cursor, optionalAfter, optionalBefore)
        .catch(err => HttpErrorHandler.bailOut(err, "callrecordings_read"))
        .then(pageOfCallRecs => {
            console.log("Got page " + pageCounter + " with " + pageOfCallRecs.data.length + " call recordings, cursor for next page is " + pageOfCallRecs.pagination.cursor);
            return downloadCallRecordings(pageOfCallRecs.data).then(() => pageOfCallRecs.pagination)
        })
        .then(pagination => {
            if (pagination.cursor != null) {
                return getTotalCallRecordingsPromise(pagination.cursor, optionalAfter, optionalBefore)
            } else {
                return Promise.resolve()
            }
        })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
console.log("07-download-call-recordings-in-parallel-with-many-options script starting\n")
console.log("Usage: node 07-download-call-recordings-in-parallel-with-many-options folderName [afterDate] [beforeDate] [cursor]\n")
console.log("       : 'folderName' is the path to a folder where the files will be stored")
console.log("       : 'afterDate'|'beforeDate' should be in RFC3339 format, are optional but strongly encouraged to be defined")
console.log("       : 'cursor' is optional and should be used if the download process misbehaves and you need to restart at a specific position/cursor")
console.log("")

folderName = null
optionalAfter = null
optionalBefore = null
optionalCursor = null

if (process.argv.length < 3) {
    console.log("Error: folderName, where the files will be stored, is a mandatory parameter")
    process.exit(1)
}

folderName = process.argv[2];

if (process.argv.length > 3) {
    optionalAfter = process.argv[3]
    if (process.argv.length > 4) {
        optionalBefore = process.argv[4]
        if (process.argv.length > 5) {
            optionalCursor = process.argv[5]
        }
    }
}

getTotalCallRecordingsPromise(optionalCursor, optionalAfter, optionalBefore)
    .then(nothing => {
        console.log("Download complete, please go to " + folderName + " and check your call recordings")
    })

// ----------------------------------------------------------------------------
