import path from "node:path";
import koffi from "koffi";
import { validateStepData, createGoalFilter } from "./tracker.js";

// Load the DLL from build/ using Node 24's import.meta.dirname
const dllPath = path.join(import.meta.dirname, "..", "build", "tracker.dll");
const lib = koffi.load(dllPath);

const calculateCumulativeSteps = lib.func(
  "long long calculateCumulativeSteps(const int *stepsArray, int size)",
);

const rawInput = [
  { day: "Monday", steps: 12450 },
  { day: "Tuesday", steps: 8300 },
  { day: "Wednesday", steps: "invalid_data" },
  { day: "Thursday", steps: 15200 },
  { day: "Friday", steps: 10000 },
  { day: "Saturday", steps: 6400 },
  { day: "Sunday", steps: 11200 },
];

const cleanData = validateStepData(rawInput);
const isSuccessfulDay = createGoalFilter(10000);
const successfulDays = cleanData.filter(isSuccessfulDay);

const stepValues = successfulDays.map((d) => d.steps);
const typedStepArray = new Int32Array(stepValues);

const totalSteps = calculateCumulativeSteps(
  typedStepArray,
  typedStepArray.length,
);

console.log("--- Pipeline Execution Complete ---");
console.log("Successful Days Count:", successfulDays.length);
console.log("Cumulative Steps (Calculated via C Pointers):", totalSteps);
