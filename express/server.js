const express = require("express");
const cors = require("cors");
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const dotenv = require("dotenv");
const crypto = require("crypto");
const sharp = require("sharp");
const { PrismaClient } = require("@prisma/client");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON request bodies

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const prisma = new PrismaClient();
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

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

app.get("/api/posts", async (req, res) => {
  const posts = await prisma.posts.findMany({ orderBy: { created: "desc" } });
  for (const post of posts) {
    const getObjectParams = {
      Bucket: bucketName,
      Key: post.imageName,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    post.imageUrl = url;
  }
  res.send(posts);
});

app.post("/api/posts", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body);
    const file = req.file;
    const caption = req.body.caption;
    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: "contain" })
      .toBuffer();
    const imageName = generateFileName();
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: fileBuffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const post = await prisma.posts.create({
      data: {
        imageName,
        caption,
      },
    });
    res.status(201).send(post);
  } catch (error) {
    console.error("Error uploading file", error);
    res.status(500).send({ message: "Error uploading file", error });
  }
});
function deleteFile(fileName) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3.send(new DeleteObjectCommand(deleteParams));
}
app.delete("/api/posts/:id", async (req, res) => {
  const id = +req.params.id;
  console.log(id);
  const post = await prisma.posts.findUnique({ where: { id } });

  await deleteFile(post.imageName);
  await prisma.posts.delete({ where: { id: post.id } });
  res.send(post);
});

app.listen(8080, () => console.log("listening on port 8080"));
