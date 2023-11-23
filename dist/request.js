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
exports.fetchSimilarCars = exports.filterDataFromImage = exports.fetchData = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
const car_model_1 = __importDefault(require("./Model/car.model"));
const ComparaisonArrays_1 = require("./Model/ComparaisonArrays");
dotenv.config();
const KEY = process.env.SUBSCRIPTION_KEY;
const URL = process.env.ENDPOINT;
// Check if .env variables are defined
if (!KEY || !URL) {
    throw new Error("Subscription key or endpoint not defined");
}
const imageUrl = "https://www.aa.co.nz/assets/motoring/blog/jazz-eHEV2.jpg";
// Function to find relevant tag from array
const findRelevantTag = (array, tag) => {
    const lowerCaseTag = tag.toLowerCase();
    const foundItem = array.find((item) => item.toLowerCase() === lowerCaseTag);
    return foundItem;
};
// Function to find relevant tag from array of colors
const findRelevantTagColor = (tag) => findRelevantTag(ComparaisonArrays_1.colors, tag);
// Function to find relevant tag from array of car types
const findRelevantTagCar = (tag) => findRelevantTag(ComparaisonArrays_1.cars, tag);
// Function to find relevant tag from array of car brands
const findRelevantTagCarBrand = (tag) => findRelevantTag(ComparaisonArrays_1.carBrands, tag);
// Function to fetch data from Azure Computer Vision API and return tags from url
const fetchData = (url) => __awaiter(void 0, void 0, void 0, function* () {
    // Axios config for sending request to Azure Computer Vision API
    const axiosConfig = {
        method: "post",
        url: URL,
        data: {
            url: url,
        },
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": KEY,
        },
    };
    try {
        const response = yield (0, axios_1.default)(axiosConfig);
        const data = response.data.tagsResult.values;
        console.log(data);
        const colorTags = [];
        const carTypeTag = [];
        const carBrandTag = [];
        // map through data and find relevent tags
        data.map((item) => {
            const tagColor = findRelevantTagColor(item.name);
            const tagCar = findRelevantTagCar(item.name);
            const tagCarBrand = findRelevantTagCarBrand(item.name);
            if (tagColor) {
                tagColor.toLowerCase();
                colorTags.push(tagColor);
            }
            if (tagCar) {
                tagCar.toLowerCase();
                carTypeTag.push(tagCar);
            }
            if (tagCarBrand) {
                tagCarBrand.toLowerCase();
                carBrandTag.push(tagCarBrand);
            }
        });
        // create object of tags with all tags
        const fullTags = {
            colorTags,
            carTypeTag,
            carBrandTag,
        };
        console.log(fullTags);
        // create object of tags with only first index 0
        const tags = {
            colorTags: colorTags[0],
            carTypeTag: carTypeTag[0],
            carBrandTag: carBrandTag[0],
        };
        console.log(tags);
        return tags;
    }
    catch (error) {
        console.error("Error:", error.response);
    }
});
exports.fetchData = fetchData;
// Function to filter data from image tags coming from frontend (Azure Computer Vision API) and return relevent tags from it
const filterDataFromImage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const colorTags = [];
        const carTypeTag = [];
        const carBrandTag = [];
        // map through data and find relevent tags
        data.map((item) => {
            const tagColor = findRelevantTagColor(item.name);
            const tagCar = findRelevantTagCar(item.name);
            const tagCarBrand = findRelevantTagCarBrand(item.name);
            if (tagColor) {
                tagColor.toLowerCase();
                colorTags.push(tagColor);
            }
            if (tagCar) {
                tagCar.toLowerCase();
                carTypeTag.push(tagCar);
            }
            if (tagCarBrand) {
                tagCarBrand.toLowerCase();
                carBrandTag.push(tagCarBrand);
            }
        });
        // create object of tags with all tags and tags
        const fullTags = {
            colorTags,
            carTypeTag,
            carBrandTag,
        };
        // create object of tags with only first index tag
        const tags = {
            colorTags: colorTags[0],
            carTypeTag: carTypeTag[0],
            carBrandTag: carBrandTag[0],
        };
        return tags;
    }
    catch (error) {
        console.error("Error:", error.response);
    }
});
exports.filterDataFromImage = filterDataFromImage;
// Function to fetch similar cars from database based on tags
const fetchSimilarCars = (tags) => __awaiter(void 0, void 0, void 0, function* () {
    const { colorTags, carTypeTag, carBrandTag } = tags;
    const query = {};
    if (tags) {
        if (colorTags) {
            if (colorTags === "") {
                // Assuming you want to search for the provided color
            }
            else {
                // Assuming you want to search for the provided color
                query.color = colorTags
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ");
            }
        }
        if (carTypeTag) {
            query.type = carTypeTag
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");
        }
    }
    // data from database based on query
    const result = yield car_model_1.default.find(query);
    return result;
});
exports.fetchSimilarCars = fetchSimilarCars;
