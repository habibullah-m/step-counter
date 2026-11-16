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
    return record.steps > targetSteps;
  };
}
