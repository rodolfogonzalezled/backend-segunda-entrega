import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT,
    useDB: process.env.USE_DB,
    urlMongoDB: process.env.URL_MONGO,
};