import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import registrationRoutes from "./routes/teacherRoutes";
import dotenv from "dotenv";

dotenv.config();

interface Env {
  MONGODB_URI: string;
  PORT: string;
}

const env: Env = {
  MONGODB_URI: process.env.MONGODB_URI!,
  PORT: process.env.PORT!,
};

const app = express();
const PORT = env.PORT;
const DB_URI = env.MONGODB_URI;

// Connect to the MongoDB database
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use(bodyParser.json());
app.use(cors());

app.use("/api", registrationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
