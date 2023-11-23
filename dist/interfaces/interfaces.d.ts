export interface Tags {
    colorTags?: string | undefined;
    carTypeTag?: string | undefined;
    carBrandTag?: string | undefined;
}
export interface Data {
    name: string;
    confidence: number;
}
export interface CarModelType {
    image: string;
    brand: string;
    color: string;
    price: number;
    type: string;
}
export interface Query {
    color?: string;
    type?: string;
}
