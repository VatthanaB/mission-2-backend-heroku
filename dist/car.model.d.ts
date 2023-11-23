import mongoose, { Document } from "mongoose";
interface Car extends Document {
    image: string;
    brand: string;
    color: string;
    price: number;
    type: string;
}
declare const CarModel: mongoose.Model<Car, {}, {}, {}, mongoose.Document<unknown, {}, Car> & Car & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default CarModel;
