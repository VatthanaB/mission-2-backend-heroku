// Interface for car tags
export interface Tags {
  colorTags?: string | undefined;
  carTypeTag?: string | undefined;
  carBrandTag?: string | undefined;
}

// Interface for data from azure computer vision api
export interface Data {
  name: string;
  confidence: number;
}

// Interface for car model
export interface CarModelType {
  image: string;
  brand: string;
  color: string;
  price: number;
  type: string;
}

// Interface for query
export interface Query {
  color?: string;
  type?: string;
  // brand: string;
}
