import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

import dotenv from 'dotenv';

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const storage = new GridFsStorage({
    url: `mongodb://${username}:${password}@ac-fx5seyu-shard-00-00.hteqb4w.mongodb.net:27017,ac-fx5seyu-shard-00-01.hteqb4w.mongodb.net:27017,ac-fx5seyu-shard-00-02.hteqb4w.mongodb.net:27017/?ssl=true&replicaSet=atlas-cn6fy5-shard-0&authSource=admin&retryWrites=true&w=majority&appName=whatsupclon`,
    options: { useNewUrlParser: true },
    file: (request, file) => {
        const match = ["image/png", "image/jpg"];

        if(match.indexOf(file.memeType) === -1) 
            return`${Date.now()}-blog-${file.originalname}`;

        return {
            bucketName: "photos",
            filename: `${Date.now()}-blog-${file.originalname}`
        }
    }
});

export default multer({storage}); 