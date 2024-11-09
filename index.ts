import dotenv from 'dotenv'
dotenv.config();
import multer from 'multer'
import express from 'express'
import * as fs from 'fs'
import util from 'util'
import { getFileStream, uploadFile } from './s3-v3';

const app = express();
const upload = multer({dest:'uploads/'})
const unlinkFile = util.promisify(fs.unlink)

app.get('/:key', async(req,res) => {
    const key:string = req.params.key;

    const readStream = await getFileStream(key);
    
    readStream.pipe(res)
})

app.post('', upload.single('image'), async (req,res) => {
    const file = req.file;
    
    if (!file) {
        throw new Error('there is no file')
    }
    const result = await uploadFile(file);
    console.log(result);
    
    await unlinkFile(file?.path)

    const s3FilePath = `https://yesari-s3-bucket.s3.us-east-1.amazonaws.com/${file.filename}`
    
    res.status(201).json(s3FilePath)
})

app.listen(8080, () => {
    console.log(`Server running on 8080`);
})


