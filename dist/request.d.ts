import { Tags, Data, CarModelType } from "./interfaces/interfaces";
export declare const fetchData: (url: string) => Promise<{
    colorTags: string;
    carTypeTag: string;
    carBrandTag: string;
} | undefined>;
export declare const filterDataFromImage: (data: Data[]) => Promise<{
    colorTags: string;
    carTypeTag: string;
    carBrandTag: string;
} | undefined>;
export declare const fetchSimilarCars: (tags: Tags) => Promise<CarModelType[]>;
