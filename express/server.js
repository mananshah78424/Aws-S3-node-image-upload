const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON request bodies

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

app.post("/api/posts", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const params = {
      Bucket: bucketName,
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    const data = await s3.send(command);

    console.log("File was sent to AWS", data);
    res.status(200).send({ message: "File uploaded successfully", data });
  } catch (error) {
    console.error("Error uploading file", error);
    res.status(500).send({ message: "Error uploading file", error });
  }
});

app.listen(8080, () => console.log("listening on port 8080"));
