import axios, { AxiosRequestConfig } from "axios";
import * as dotenv from "dotenv";
import CarModel from "./Model/car.model";
import { colors, cars, carBrands } from "./Model/ComparaisonArrays";
import { Tags, Data, CarModelType, Query } from "./interfaces/interfaces";
dotenv.config();

const KEY: string | undefined = process.env.SUBSCRIPTION_KEY;
const URL: string | undefined = process.env.ENDPOINT;

// Check if .env variables are defined
if (!KEY || !URL) {
  throw new Error("Subscription key or endpoint not defined");
}

const imageUrl = "https://www.aa.co.nz/assets/motoring/blog/jazz-eHEV2.jpg";

// Function to find relevant tag from array
const findRelevantTag = (array: string[], tag: string) => {
  const lowerCaseTag = tag.toLowerCase();
  const foundItem = array.find((item) => item.toLowerCase() === lowerCaseTag);
  return foundItem;
};
// Function to find relevant tag from array of colors
const findRelevantTagColor = (tag: string) => findRelevantTag(colors, tag);
// Function to find relevant tag from array of car types
const findRelevantTagCar = (tag: string) => findRelevantTag(cars, tag);
// Function to find relevant tag from array of car brands
const findRelevantTagCarBrand = (tag: string) =>
  findRelevantTag(carBrands, tag);

// Function to fetch data from Azure Computer Vision API and return tags from url
export const fetchData = async (url: string) => {
  // Axios config for sending request to Azure Computer Vision API
  const axiosConfig: AxiosRequestConfig = {
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
    const response = await axios(axiosConfig);

    const data = response.data.tagsResult.values;
    console.log(data);
    const colorTags: string[] = [];
    const carTypeTag: string[] = [];
    const carBrandTag: string[] = [];
    // map through data and find relevent tags
    data.map((item: any) => {
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
  } catch (error: any) {
    console.error("Error:", error.response);
  }
};

// Function to filter data from image tags coming from frontend (Azure Computer Vision API) and return relevent tags from it
export const filterDataFromImage = async (data: Data[]) => {
  try {
    const colorTags: string[] = [];
    const carTypeTag: string[] = [];
    const carBrandTag: string[] = [];
    // map through data and find relevent tags
    data.map((item: any) => {
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
  } catch (error: any) {
    console.error("Error:", error.response);
  }
};

// Function to fetch similar cars from database based on tags
export const fetchSimilarCars = async (tags: Tags): Promise<CarModelType[]> => {
  const { colorTags, carTypeTag, carBrandTag } = tags;

  const query: Query = {};

  if (tags) {
    if (colorTags) {
      if (colorTags === "") {
        // Assuming you want to search for the provided color
      } else {
        // Assuming you want to search for the provided color
        query.color = colorTags
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");
      }
    }

    if (carTypeTag) {
      query.type = carTypeTag
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }
  }

  // data from database based on query
  const result = await CarModel.find(query);

  return result;
};
