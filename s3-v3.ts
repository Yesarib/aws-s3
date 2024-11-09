import { S3Client, PutObjectCommand, GetObjectCommand, PutObjectCommandOutput, GetObjectCommandOutput, ObjectCannedACL } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import { Readable } from 'stream';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const publicKey = process.env.AWS_PUBLIC_KEY;
const secretKey = process.env.AWS_SECRET_KEY;

if (!publicKey || !secretKey) {
    throw new Error("AWS credentials are not set");
}

const s3 = new S3Client({
    region: region,
});

export async function uploadFile(file: any): Promise<PutObjectCommandOutput> {
    if (!bucketName) {
        throw new Error("Bucket name is not defined");
    }

    const fileStream = fs.createReadStream(file.path);
    
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
        ACL: ObjectCannedACL.public_read,
        ContentType:"image/png"
    };

    const command = new PutObjectCommand(uploadParams);

    try {
        const data = await s3.send(command);
        return data;
    } catch (err) {
        throw new Error(`Error uploading file: ${err}`);
    }
}

export async function getFileStream(fileKey: string): Promise<Readable> {
    if (!bucketName) {
        throw new Error("Bucket name is not defined");
    }

    const params = {
        Bucket: bucketName,
        Key: fileKey
    };

    const command = new GetObjectCommand(params);

    try {
        const data = await s3.send(command);
        if (data.Body) {
            return data.Body as Readable;
        } else {
            throw new Error("File stream not found");
        }
    } catch (err) {
        throw new Error(`Error fetching file: ${err}`);
    }
}
