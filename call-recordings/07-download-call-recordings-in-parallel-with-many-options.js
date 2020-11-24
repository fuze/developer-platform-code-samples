// ----------------------------------------------------------------------------
// DOWNLOAD ALL CALL RECORDINGS SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code retrieves all call recordings available for your
// organization.
// The call recordings returned in the responses are only limited by the scope
// of the authentication token.

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
var callRecordings = []

// ----------------------------------------------------------------------------
// Download recordings sequentially
// ----------------------------------------------------------------------------
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
            var dir = "./data/" + date.getUTCFullYear() + "/" + (date.getUTCMonth()+1) + "/" + date.getUTCDate() + "/" + date.getUTCHours();
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
// add all call recording from a page of call recordings to the array
// ----------------------------------------------------------------------------
function keepRecordings(responseRecordingsList) {
  responseRecordingsList.forEach(function (r) {
    callRecordings.push(r)
  })
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
                return Promise.resolve(callRecordings)
            }
        })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
console.log("07-download-call-recordings-in-parallel-with-many-options")
console.log("Usage: node 07-download-call-recordings-in-parallel-with-many-options [afterDate] [beforeDate] [cursor]")
console.log("       Dates should be in RFC3339 format and are optional")

optionalAfter = null
optionalBefore = null
optionalCursor = null

if (process.argv.length > 2) {
    optionalAfter = process.argv[2]
    if (process.argv.length > 3) {
        optionalBefore = process.argv[3]
        if (process.argv.length > 4) {
            optionalCursor = process.argv[4]
        }
    }
}

getTotalCallRecordingsPromise(optionalCursor, optionalAfter, optionalBefore)
    .then(allCallRecording => {
        console.log("Found a total of " + allCallRecording.length + " call recordings, will now download audio")
    })

// ----------------------------------------------------------------------------
