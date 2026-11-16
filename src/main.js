import fs from "node:fs";
import path from "node:path";
import koffi from "koffi";
import { validateStepData, createGoalFilter } from "./tracker.js";

// 1. Load the compiled C DLL
const dllPath = path.join(import.meta.dirname, "..", "build", "tracker.dll");
const lib = koffi.load(dllPath);

const calculateCumulativeSteps = lib.func(
  "long long calculateCumulativeSteps(const int *stepsArray, int size)",
);

// 2. Import daily step counts from external JSON file
const dataPath =
  process.argv[2] || path.join(import.meta.dirname, "..", "data", "steps.json");
const targetGoal = Number(process.argv[3]) || 10000;
const rawInput = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// 3. Validate data & filter days where steps > targetGoal using closure factory
const cleanData = validateStepData(rawInput);
const isSuccessfulDay = createGoalFilter(targetGoal);
const successfulDays = cleanData.filter(isSuccessfulDay);

// 4. Pass contiguous Int32Array pointer to C for cumulative calculation
const stepValues = successfulDays.map((d) => d.steps);
const typedStepArray = new Int32Array(stepValues);

const totalSteps = calculateCumulativeSteps(
  typedStepArray,
  typedStepArray.length,
);

console.log(
  `--- Pipeline Execution Complete (Goal: > ${targetGoal} steps) ---`,
);
console.log(
  "Successful Days:",
  successfulDays.map((d) => `${d.day} (${d.steps})`).join(", "),
);
console.log("Successful Days Count:", successfulDays.length);
console.log("Cumulative Steps (Calculated via C Pointers):", totalSteps);
