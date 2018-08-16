const functions = require('firebase-functions');

var os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;
const cors = require('cors')({origin: true});
const Busboy = require('busboy');
const fs = require('fs');
// this key needs to be passed into google cloud storage before you can upload files
const gcconfig ={
  projectId: "uploadimages-4132e",
  keyFileName: "uploadimages-4132e-firebase-adminsdk-43wd1-798654bd37"
}
const gcs = require('@google-cloud/storage')(gcconfig);
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


  if(path.basename(filePath).startsWith('resized-')) {
    console.log('this file has been renamed');
    return;
  }

  const destBucket = gcs.bucket(object);
  const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
  const metadata = { contentType: contentType };

  return destBucket.file(filePath).download({
    destination: tmpFilePath
  }).then(() => {
  return spawn('convert', [tmpFilePath, '-resize', '500X500', tmpFilePath])

  }).then(() => {
     return destBucket.upload(tmpFilePath, {
    destination: 'resized-' + path.basename(filePath),
    metadata: metadata
  })
});
});

exports.onFileDelete = functions.storage.object().onDelete(event => {
  console.log(event);
  return;
});

exports.uploadFile = functions.https.onRequest((req, res, event) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(500).json({
        message: 'Not Allowed!'

      })
        }
        const busboy = new Busboy({headers: req.headers});
        let uploadData = null;
        busboy.on("file", (filename, file, encoding, mimetype) => {
            const filepath = path.join(os.tmpdir(), filename);
            uploadData = {file: filepath, type: mimetype};
            file.pipe(fs.createWriteStream(filepath));
        });
        //console.log('this is my event event.contentType ' + event.contentType);
        //console.log('this is my event uploadData.type ' + uploadData.type);
        busboy.on("finish", () => {
          const bucket = gcs.bucket("uploadimages-4132e.appspot.com");
          bucket
            .upload(uploadData.file, {
            uploadType: 'media',
            metadata: {
              contentType: uploadData.contentType
            }

        })
        .then(() => {

          res.status(200).json({
            message: 'it worked!'

            });
        })
        .catch(err => {

           res.status(500).json({
              error: err
            });

        });


  });
  busboy.end(req.rawBody);
  });
});
