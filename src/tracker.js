/**
 * src/tracker.js - Data Validation and Closure Factory (ESM)
 */

export function validateStepData(rawData) {
  if (!Array.isArray(rawData)) {
    throw new TypeError("Input data must be an array of daily records.");
  }

  return rawData.filter((item) => {
    const isValid =
      item &&
      typeof item.day === "string" &&
      typeof item.steps === "number" &&
      !Number.isNaN(item.steps) &&
      item.steps >= 0;

    if (!isValid) {
      console.warn(`[Validation Warning] Skipping malformed record:`, item);
    }
    return isValid;
  });
}

export function createGoalFilter(targetSteps) {
  return function (record) {
    return record.steps >= targetSteps;
  };
}

// Run standalone test if executed directly (`node src/tracker.js`)
if (process.argv[1] === import.meta.filename) {
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
  console.log(
    "Validated & Filtered Successful Days:",
    cleanData.filter(isSuccessfulDay),
  );
}
