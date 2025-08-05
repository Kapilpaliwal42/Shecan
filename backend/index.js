import express from "express";
import cors from "cors";
import Router from "./Routes.js";
import dotenv from 'dotenv'
import DB_connect from "./DBconnect.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", Router);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await DB_connect();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database. Server not started.", error);
        process.exit(1);
    }
};

startServer();
