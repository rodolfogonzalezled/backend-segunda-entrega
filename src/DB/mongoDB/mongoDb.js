import mongoose from "mongoose";

export const connectMongo = async () => {
    const URL = "mongodb://localhost:27017/ecommerce";
    await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("DB Connected");
}