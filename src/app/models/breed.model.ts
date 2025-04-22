export interface BreedList {
  message: {
    [breed: string]: string[];
  };
  status: string;
}

export interface DogImage {
  url: string;
  breed: string;
}