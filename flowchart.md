# Step Counter Project Flowcharts

**Assignment:** All functions and modules in this report are assigned to **Harry Eliki** (24/ENG09/030).

## 1. `validateStepData(rawData)` — Harry Eliki

```mermaid
flowchart TD
  A([Start]) --> B{Input is an array?}
  B -- No --> C[Raise TypeError]
  C --> Z([End with error])
  B -- Yes --> D[Create empty valid-record list]
  D --> E{More records?}
  E -- No --> F[Return valid-record list]
  F --> G([End])
  E -- Yes --> H[Read next record]
  H --> I{Exists, string day, numeric non-NaN steps, steps >= 0?}
  I -- Yes --> J[Keep record]
  I -- No --> K[Warn and skip record]
  J --> E
  K --> E
```

## 2. `createGoalFilter(targetSteps)` — Harry Eliki

```mermaid
flowchart TD
  A([Start]) --> B[Capture targetSteps]
  B --> C[Return predicate for a record]
  C --> D{record.steps > targetSteps?}
  D -- Yes --> E[Return true]
  D -- No --> F[Return false]
  E --> G([End])
  F --> G
```

## 3. `src/main.js` main pipeline — Harry Eliki

```mermaid
flowchart TD
  A([Start]) --> B[Build DLL path and load C library]
  B --> C[Bind calculateCumulativeSteps signature]
  C --> D{Data path argument supplied?}
  D -- Yes --> E[Use supplied path]
  D -- No --> F[Use default data/steps.json]
  E --> G[Parse optional goal argument]
  F --> G
  G --> H{Parsed goal is truthy?}
  H -- Yes --> I[Use parsed goal]
  H -- No --> J[Use default goal 10000]
  I --> K[Read file and parse JSON]
  J --> K
  K --> L[Call validateStepData]
  L --> M[Create goal predicate]
  M --> N[Filter valid records by strict greater-than goal]
  N --> O[Copy successful step values to Int32Array]
  O --> P[Call C function with array and length]
  P --> Q[Print goal, successful days, count, and total]
  Q --> R([End])
```

## 4. `calculateCumulativeSteps(stepsArray, size)` — Harry Eliki

```mermaid
flowchart TD
  A([Start]) --> B[Set total to 0]
  B --> C[Set pointer to array start and end to start + size]
  C --> D{Pointer before end?}
  D -- Yes --> E[Add value at pointer to total]
  E --> F[Advance pointer]
  F --> D
  D -- No --> G[Return total]
  G --> H([End])
```

## 5. `main()` standalone C demo — Harry Eliki

```mermaid
flowchart TD
  A([Start]) --> B[Create sample steps array]
  B --> C[Determine array element count]
  C --> D[Call calculateCumulativeSteps]
  D --> E[Print cumulative total]
  E --> F[Return 0]
  F --> G([End])
```
