# Fuze Developer Center Code Samples
These samples are written in node.js

## Dependencies
You need to have `node.js` installed on your system. On a Mac you can use `brew` to install it, 
on Windows go to https://nodejs.org/en/download/ and download the installer.

There are three external dependencies that need to be installed: 
* httplease
* node-stringbuilder
* sprintf-js
* fs

Install them running `npm install httplease node-stringbuilder sprintf-js fs`
## Sample code organization
There's a file named `config.js` at the base directory of the code samples. You should edit this file to add
your authentication token.

```
.
|-- call-recordings
|   |-- 01-get-all-call-recordings.js
|   |-- 02-get-last-two-weeks-call-recordings.js
|   |-- 03-get-one-call-recording.js
|   |-- 04-download-all-call-recordings.js
|   |-- 05-download-last-two-weeks-call-recordings.js
|   `-- 06-download-one-call-recording.js
|-- departments
|   |-- 01-list-your-organization-departments.js
|   `-- 02-find-the-departments-with-more-users.js
|-- locations
|   |-- 01-get-locations-optionally-by-country.js
|   `-- 02-find-the-location-with-more-users.js
|-- meetings
|   |-- 01-get-all-meetings.js
|   |-- 02-get-meeting-by-id.js
|   |-- 03-delete-meeting-by-id.js
|   `-- 04-create-a-new-meeting.js
|-- organizations
|   |-- 01-get-all-organizations.js
|   `-- 02-get-organization-by-code.js
|-- users
|   |-- 01-get-all-users.js
|   `-- 02-get-users-with-call-recordings-from-yesterday.js
|-- README.md
`-- config.js

```
## How to run
 From the base directory run each sample file with: `node directory/sample-filename.js`
