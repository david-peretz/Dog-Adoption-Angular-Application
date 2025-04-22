export interface AdoptionRequest {
  weight: number;
  color: string;
  isFirstAdoption: boolean;
  age: number;
}

export const DOG_COLORS = [
  'White',
  'Black',
  'Brown',
  'Golden',
  'Gray',
  'Mixed'
];