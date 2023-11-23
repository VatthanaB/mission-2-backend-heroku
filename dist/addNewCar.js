"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const car_model_1 = __importDefault(require("./car.model"));
const newCarData = {
    image: "car_image_url",
    brand: "Toyota",
    color: "Blue",
    price: 25000,
    type: "Sedan",
};
const newCar = new car_model_1.default(newCarData);
newCar
    .save()
    .then((savedCar) => {
    console.log("Saved car:", savedCar);
})
    .catch((error) => {
    console.error("Error saving car:", error);
});
