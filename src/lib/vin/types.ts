export interface DecodedVehicle {
  vin: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  bodyStyle: string;
  engine: string;
  transmission: string;
  fuelType: string;
  driveType: string;
  manufacturer: string;
  plant: string;
}

export interface VinValidationResult {
  valid: boolean;
  normalized?: string;
  message?: string;
}
