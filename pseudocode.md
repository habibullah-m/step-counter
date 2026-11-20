# Step Counter Project Pseudocode

**Assignment:** All functions and modules in this report are assigned to **Harry Eliki** (24/ENG09/030).

## Function and module inventory

| File | Function or module | Responsibility | Assignee |
|---|---|---|---|
| `src/tracker.js` | `validateStepData(rawData)` | Reject non-array input; keep well-formed daily step records and warn for skipped records. | Harry Eliki |
| `src/tracker.js` | `createGoalFilter(targetSteps)` | Return a predicate that accepts records whose steps are strictly greater than the target. | Harry Eliki |
| `src/main.js` | Main pipeline (module body) | Read CLI options and JSON, validate and filter records, call the C library, and print results. | Harry Eliki |
| `src/tracker.c` | `calculateCumulativeSteps(stepsArray, size)` | Sum an integer array by traversing it with a pointer. | Harry Eliki |
| `src/tracker.c` | `main()` standalone demo | Supply sample steps to the C calculator and print the total. | Harry Eliki |

## 1. `validateStepData(rawData)` — Harry Eliki

```text
FUNCTION validateStepData(rawData)
  IF rawData is not an array
    Raise a TypeError explaining that daily records must be an array
  END IF

  Create an empty list of valid records
  FOR EACH item in rawData
    A record is valid only if:
      item exists
      item.day is a string
      item.steps is a number
      item.steps is not NaN
      item.steps is greater than or equal to zero

    IF item is valid
      Add item to the valid records
    ELSE
      Warn that the malformed item is being skipped
    END IF
  END FOR

  RETURN valid records
END FUNCTION
```

## 2. `createGoalFilter(targetSteps)` — Harry Eliki

```text
FUNCTION createGoalFilter(targetSteps)
  RETURN a function(record) that checks:
    record.steps is strictly greater than targetSteps
END FUNCTION
```

The comparison is strict: a record exactly equal to the target does not pass.

## 3. `src/main.js` main pipeline — Harry Eliki

```text
START main module
  Set the DLL path to build/tracker.dll relative to this module
  Load the DLL with Koffi
  Bind calculateCumulativeSteps with its C signature

  Read the optional JSON file path from the first CLI argument
  IF no path was supplied, use data/steps.json

  Convert the optional second CLI argument to a number
  IF the result is falsy (including missing, zero, or NaN), use 10000

  Read the selected file and parse its JSON
  Call validateStepData(raw input)
  Create a goal predicate with createGoalFilter(target goal)
  Keep only valid records accepted by that predicate

  Extract the successful records' step counts
  Copy the counts into an Int32Array
  Call the C function with the typed array and its length

  Print the goal, successful days, successful-day count, and cumulative total
END main module
```

## 4. `calculateCumulativeSteps(stepsArray, size)` — Harry Eliki

```text
FUNCTION calculateCumulativeSteps(stepsArray, size)
  Set total to 0
  Set pointer to the first array element
  Set end pointer to the first element plus size

  WHILE pointer is before end pointer
    Add the value at pointer to total
    Advance pointer to the next element
  END WHILE

  RETURN total
END FUNCTION
```

## 5. `main()` standalone C demo — Harry Eliki

```text
FUNCTION main()
  Create sample array [12450, 15200, 10000, 11200]
  Compute its element count
  Call calculateCumulativeSteps(sample array, count)
  Print the returned cumulative total
  RETURN 0
END FUNCTION
```
