// ----------------------------------------------------------------------------
// GET ONE ORGANIZATION BY CODE
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const httplease = require("httplease");
const OrganizationsConnector = require('../connectors/OrganizationsConnector.js')

var connector = new OrganizationsConnector(config)

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
function showOrgAsJSON(org) {
  console.log("\nOrganization\n" + JSON.stringify(org));
}

// ----------------------------------------------------------------------------
// Very basic error handler
// ----------------------------------------------------------------------------
function bailOut(err) {
    if (err instanceof httplease.errors.UnexpectedHttpResponseCodeError) {
        console.log(err.response.statusCode);
        console.log(err.response.headers);
        console.log(err.response.body);
    } else {
        console.log(err.message)
    }
    process.exit(1);
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
if (process.argv.length < 3) {
  console.log("Invalid number of parameters... missing organization code")
} else {
  myRecordingId = process.argv[2];
  connector.getOrganizationPromise(myRecordingId)
      .catch(bailOut)
      .then(organization => {
        showOrgAsJSON(organization)
      });
}
// ----------------------------------------------------------------------------
