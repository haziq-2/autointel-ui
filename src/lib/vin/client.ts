import type { DecodedVehicle } from "@/lib/vin/types";

const KNOWN_VINS: Record<string, Omit<DecodedVehicle, "vin">> = {
  "1HGCM82633A004352": {
    year: "2003",
    make: "Honda",
    model: "Accord",
    trim: "EX-V6",
    bodyStyle: "Coupe",
    engine: "3.0L V6",
    transmission: "Automatic",
    fuelType: "Gasoline",
    driveType: "FWD",
    manufacturer: "Honda of America Mfg., Inc.",
    plant: "Marysville, Ohio",
  },
  "1FTFW1E84MFA12345": {
    year: "2021",
    make: "Ford",
    model: "F-150",
    trim: "Lariat",
    bodyStyle: "Pickup",
    engine: "3.5L V6 Twin Turbo",
    transmission: "Automatic",
    fuelType: "Gasoline",
    driveType: "4WD",
    manufacturer: "Ford Motor Company",
    plant: "Dearborn, Michigan",
  },
};

const MAKES = ["Toyota", "Ford", "Honda", "Chevrolet", "Ram", "Jeep", "Tesla"];
const MODELS = ["Camry", "F-150", "CR-V", "Silverado", "1500", "Grand Cherokee", "Model Y"];
const TRIMS = ["Base", "Sport", "XLE", "Lariat", "LT", "Limited", "Long Range"];
const BODY_STYLES = ["Sedan", "SUV", "Pickup", "Coupe", "Hatchback"];
const ENGINES = ["2.5L I4", "3.5L V6", "5.7L V8", "Dual Motor EV", "2.0L Turbo I4"];
const TRANSMISSIONS = ["Automatic", "CVT", "Manual", "Single-Speed"];
const FUEL_TYPES = ["Gasoline", "Hybrid", "Electric", "Diesel"];
const DRIVE_TYPES = ["FWD", "RWD", "AWD", "4WD"];
const PLANTS = ["Texas", "Ohio", "Michigan", "Tennessee", "California"];

function pick<T>(items: T[], seed: number): T {
  return items[seed % items.length];
}

function generateFromVin(vin: string): Omit<DecodedVehicle, "vin"> {
  const seed = vin.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    year: String(2015 + (seed % 10)),
    make: pick(MAKES, seed),
    model: pick(MODELS, seed + 3),
    trim: pick(TRIMS, seed + 5),
    bodyStyle: pick(BODY_STYLES, seed + 7),
    engine: pick(ENGINES, seed + 11),
    transmission: pick(TRANSMISSIONS, seed + 13),
    fuelType: pick(FUEL_TYPES, seed + 17),
    driveType: pick(DRIVE_TYPES, seed + 19),
    manufacturer: `${pick(MAKES, seed)} Motor Company`,
    plant: `${pick(PLANTS, seed)}, USA`,
  };
}

export async function decodeVin(vin: string): Promise<DecodedVehicle> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (vin === "00000000000000000") {
    throw new Error("No vehicle information was found for this VIN.");
  }

  const known = KNOWN_VINS[vin];
  if (known) {
    return { vin, ...known };
  }

  return { vin, ...generateFromVin(vin) };
}
