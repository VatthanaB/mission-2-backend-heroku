import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import CarModel from "./Model/car.model";
import bodyParser from "body-parser";
import { fetchData, fetchSimilarCars, filterDataFromImage } from "./request";
import { Tags } from "./interfaces/interfaces";
import axios from "axios";
// import .env variables
const MONGOURL = process.env.MONGO;
const KEY = process.env.SUBSCRIPTION_KEY;
const URL = process.env.ENDPOINT;
const PORT = process.env.PORT;
// Create Express server
const app = express();

// Express configuration - middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

// MongoDB connection
const mangoURL: string = MONGOURL || "mongodb://localhost:27017/cars";

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
// POST endpoint to analyze image and return similar cars
app.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;
    // console.log("imageUrl", imageUrl);

    const tags: Tags | undefined = await fetchData(imageUrl);
    let result;
    if (tags) {
      // fetch similar cars from database
      result = await fetchSimilarCars(tags);
    } else {
      res.status(400).json({
        error: "No tags found, image might not be relevent to cars. ",
      });
    }

    res.status(200).json({ tags: tags, result: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST endpoint to analyze image and return similar cars from database using fata from image
app.post("/analyzeImage", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("data", data);
    // console.log("imageUrl", imageUrl);

    let tags: Tags | undefined;
    tags = await filterDataFromImage(data);
    let result = {};
    if (tags) {
      // fetch similar cars from database
      result = await fetchSimilarCars(tags);
    } else {
      res.status(400).json({
        error: "No tags found, image might not be relevent to cars.  ",
      });
    }

    res.status(200).json({ tags: tags, result: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// POST endpoint to create a new car in the database
app.post("/cars", async (req, res) => {
  try {
    const { image, brand, color, price, type } = req.body;

    // Validate required fields
    if (!image || !brand || !color || !price || !type) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCarData = {
      image,
      brand,
      color,
      price,
      type,
    };

    const newCar = new CarModel(newCarData);
    const savedCar = await newCar.save();

    res.status(201).json(savedCar);
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/azure", async (req, res) => {
  const axiosConfig = {
    method: "post",
    url: URL,
    data: {
      url: "https://di-uploads-pod15.dealerinspire.com/lakeforestsportscars/uploads/2019/10/Ferrari-LaFerrari-Aperta.jpg",
    },
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": KEY,
    },
  };
  try {
    const response = await axios(axiosConfig);

    const data = response.data.tagsResult.values;
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error:", error.response);
  }
});
// mongo connection and server start
mongoose
  .connect(mangoURL, {
    serverSelectionTimeoutMS: 5000, // Increase the timeout value
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
