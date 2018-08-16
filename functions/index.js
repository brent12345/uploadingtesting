const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
var os = require('os');
const path = require('path');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.onFileChange = functions.storage.object().onFinalize(event => {
  console.log(event);
  // holds the bucket name here
  const object = event.bucket;
  //const bucket = object.bucket;
  const contentType = event.contentType;
  const filePath = event.name;
  console.log('File change detected, function excution started');
  console.log('This is my object' + object);
  //console.log('This is my bucket' + bucket);
  console.log('This is my contentType ' + contentType);
  console.log('This is my filepath ' + filePath);
  console.log('This is my link ' + event.selfLink);
  console.log('This is my ID ' + event.id);
  console.log('This is my name ' + event.name);
  if(path.basename(filePath).startsWith('renamed-')) {
    console.log('this file has been renamed');
    return;
  }

  const destBucket = gcs.bucket(object);
  const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
  const metadata = { contentType: contentType };

  return destBucket.file(filePath).download({
    destination: tmpFilePath
}).then(() => {
  return destBucket.upload(tmpFilePath, {
    destination: 'renamed-' + path.basename(filePath),
    metadata: metadata
  })
});
});

exports.onFileDelete = functions.storage.object().onDelete(event => {
  console.log(event);
  return;
});
