const { string } = require("@hapi/joi");
const AWS = require("aws-sdk");
module.exports = {
  upload: async (file, type, folder) => {
    try {
      // console.log("Into Upload FILE::", file);
      if (
        file !== "" &&
        file !== null &&
        file !== undefined &&
        !file.startsWith(process.env.BUCKETURL)
      ) {
        const mimeType = file.split(";")[0].split(":")[1];
        let bufferFile = new Buffer.from(
          file.split(";base64,").pop(),
          "base64"
        );
        AWS.config.update({
          accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
          secretAccessKey: `${process.env.AWS_SECRET_KEY}`,
          region: `${process.env.AWS_REGION}`,
        });
        type !== "" && type !== null && type !== undefined
          ? (type = type)
          : (type = mimeType);
        let s3 = new AWS.S3({
          params: { Bucket: `${process.env.AWS_BUCKET}/${folder}` },
        });
        let s3Key = Date.now();
        let params = {
          Key: `${s3Key}`,
          Body: bufferFile,
          ACL: "public-read",
          ContentEncoding: "base64",
          ContentType: `${type}`,
        };
        let data = await s3.upload(params).promise();
        
          console.log("Location:::::::::", data.Location);
        return data.Location;
      }
      return file;

    } catch (error) {
      console.log("Error:", error);
      return error.message;
    }
  },
};
