# Fuze Developer Center Code Samples
These samples are written in node.js

## Dependencies
You need to have `node.js` installed on your system. On a Mac you can use `brew` to install it, 
on Windows go to https://nodejs.org/en/download/ and download the installer.

There are external dependencies that need to be installed: 
* httplease
* node-stringbuilder
* sprintf-js
* fs
* readline-sync
* p-map
* readline-sync

Install them running `npm install httplease node-stringbuilder sprintf-js fs readline-sync p-map readline-sync`

## Configuration
A file named `config.js` exists at the base directory of the code samples. You should edit this
file to add your api key / authentication token.

## How to run
 From the base directory run each sample file with: `node directory/sample-filename.js`
