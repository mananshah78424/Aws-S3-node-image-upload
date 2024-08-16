const { S3Client } = require("@aws-sdk/client-s3");
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const regionName = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_USER_ACCESS_KEY;
const secretKey = process.env.AWS_USER_SECRET_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: regionName,
});

function uploadFile(fileBuffer, fileName, mimetype) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype,
  };

  return s3.send(new PutObjectCommand(uploadParams));
}

function deleteFile(fileName) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3.send(new DeleteObjectCommand(deleteParams));
}
module.exports = { s3, uploadFile, deleteFile };
