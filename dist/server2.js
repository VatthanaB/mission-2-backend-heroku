"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const car_model_1 = __importDefault(require("./car.model"));
const bodyParser = require("body-parser");
const request_1 = require("./request");
// import .env variables
const MONGOURL = process.env.MONGO;
const KEY = process.env.SUBSCRIPTION_KEY;
const URL = process.env.ENDPOINT;
// Create Express server
const app = (0, express_1.default)();
// Express configuration - middleware
app.use((0, cors_1.default)());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// Express configuration - port
const port = process.env.PORT || 5000;
// MongoDB connection
const mangoURL = MONGOURL || "mongodb://localhost:27017/cars";
// POST endpoint to analyze image and return similar cars
app.post("/analyze", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageUrl } = req.body;
        // console.log("imageUrl", imageUrl);
        const tags = yield (0, request_1.fetchData)(imageUrl);
        let result;
        if (tags) {
            // fetch similar cars from database
            result = yield (0, request_1.fetchSimilarCars)(tags);
        }
        else {
            res.status(400).json({ error: "No tags found" });
        }
        res.status(200).json({ tags: tags, result: result });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// POST endpoint to analyze image and return similar cars from database using fata from image
app.post("/analyzeImage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        console.log("data", data);
        // console.log("imageUrl", imageUrl);
        let tags;
        tags = yield (0, request_1.filterDataFromImage)(data);
        let result = {};
        if (tags) {
            // fetch similar cars from database
            result = yield (0, request_1.fetchSimilarCars)(tags);
        }
        else {
            res.status(400).json({ error: "No tags found" });
        }
        res.status(200).json({ tags: tags, result: result });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// POST endpoint to create a new car in the database
app.post("/cars", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newCar = new car_model_1.default(newCarData);
        const savedCar = yield newCar.save();
        res.status(201).json(savedCar);
    }
    catch (error) {
        console.error("Error creating car:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// mongo connection and server start
mongoose_1.default
    .connect(mangoURL, {
    serverSelectionTimeoutMS: 5000, // Increase the timeout value
})
    .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
})
    .catch((err) => {
    console.error(err);
});
