import { S3 } from "aws-sdk";
import * as fs from 'fs'

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION
const publicKey = process.env.AWS_PUBLIC_KEY
const secretKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region:region,
    accessKeyId:publicKey,
    secretAccessKey:secretKey
})

export function uploadFile(file:any) {
    if (!bucketName) {
        throw new Error("Bucket name is not defined");
    }

    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise()
}

export function getFileStream(fileKey:string) {
    if (!bucketName) {
        throw new Error("Bucket name is not defined");
    }

    const params = {
        Key:fileKey,
        Bucket:bucketName
    }

    return s3.getObject(params).createReadStream()
}

