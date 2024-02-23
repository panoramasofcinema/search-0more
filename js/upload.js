var albumBucketName = "0more";
var bucketRegion = "eu-central-1";
var IdentityPoolId = "eu-central-1:6f0e145f-a633-4262-a989-056ced5afcd7";
var albumName = "input"

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

function uploadImg(event) {
  var files = event.target.files;
  var file = files[0];
  var fileName = file.name;
  var albumPhotosKey = encodeURIComponent(albumName) + "/";
  var photoKey = albumPhotosKey + fileName;
  
  // Use S3 ManagedUpload class as it supports multipart uploads
  var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: albumBucketName,
      Key: photoKey,
      Body: file,
      ACL:'public-read'
    }
  });
  var promise = upload.promise();
  promise.then(
    function(data) {
      alert("Successfully uploaded photo.");
      let img_name = event.target.files[0].name
      let url = "search.html?q="+img_name
      window.open(url, '_self')
   },
    function(err) {
      return alert("There was an error uploading your photo: ", err.message);
    }
  );
}