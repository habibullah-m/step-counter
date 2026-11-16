# Fitness Goal Achievement and Cumulative Activity Tracker

A hybrid **JavaScript (Node.js ES Modules)** and **C** application that imports daily step counts from a JSON dataset, validates records, filters days exceeding a target step goal using a JavaScript closure factory, and delegates cumulative step calculation to a compiled C engine using pointer arithmetic.

## Architecture & Pipeline

The application bridges high-level JavaScript functional programming with low-level C memory traversal via **Koffi** (Foreign Function Interface):

1. **Data Import (`src/main.js` & `data/steps.json`)**
   - Reads daily activity records (`{ "day": string, "steps": number }`) from `data/steps.json` (or a custom JSON path supplied via CLI).

2. **Validation & Closure Factory (`src/tracker.js`)**
   - `validateStepData(rawData)`: Sanitizes incoming records by verifying schema structure, data types, non-negative step values, and rejecting `NaN` or malformed entries with console warnings.
   - `createGoalFilter(targetSteps)`: A lexical **closure factory** that encapsulates `targetSteps` and returns a specialized predicate (`record.steps > targetSteps`) to filter days where the user exceeded their step goal.

3. **Pointer-Based Cumulative Engine (`src/tracker.c`)**
   - Compiled into a Windows Dynamic-Link Library (`build/tracker.dll`) exporting `calculateCumulativeSteps(const int *stepsArray, int size)`.
   - Traverses the contiguous `Int32Array` memory buffer exclusively via pointer bounds (`ptr < end`), pointer dereferencing (`*ptr`), and pointer incrementation (`ptr++`).

## Project Structure

```text
step-counter/
├── data/
│   └── steps.json     # Input dataset of daily step counts
├── src/
│   ├── tracker.c      # C cumulative step calculator using pointer arithmetic
│   ├── tracker.js     # JS input validator and goal closure factory (ESM)
│   └── main.js        # Entrypoint bridging JS and C via Koffi FFI
├── build/             # Auto-generated MSVC artifacts (tracker.dll, .obj, .lib, .exp)
├── build.ps1          # PowerShell script locating MSVC x64 and compiling tracker.c
└── package.json       # ES Module configuration, dependencies, and npm scripts
```

## Prerequisites

- **OS:** Windows (x64)
- **Runtime:** [Node.js](https://nodejs.org/) v20+ (tested on Node v24.19.0)
- **Compiler:** Microsoft Visual Studio / Build Tools with the **MSVC C/C++ x64** toolset (`cl.exe` and `vswhere.exe`)

## Installation

Install the Node.js FFI dependency (`koffi`):

```powershell
npm install

```

## Build & Usage

### Build and Run (Default: `data/steps.json`, Goal: `> 10000` steps)

```powershell
npm run dev

```

### Run with Custom File or Step Goal

Pass a custom JSON file path and/or step threshold as CLI arguments:

```powershell
npm start -- data/steps.json 8000

```

### Available Scripts

| Command                      | Description                                                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`              | Locates Visual Studio via `vswhere.exe`, initializes `vcvars64.bat`, and compiles `src/tracker.c` into `build/tracker.dll`. |
| `npm start`                  | Executes `src/main.js` using the default `data/steps.json` and `10000` step goal.                                           |
| `npm start -- <file> <goal>` | Runs the pipeline against a custom JSON dataset and step goal threshold.                                                    |
| `npm run dev`                | Compiles `build/tracker.dll` and immediately runs the tracker.                                                              |

## Sample Output

### Default Goal (`> 10000` steps)

```text
> step-counter@1.0.0 dev
> npm run build && npm start

Compiling src\tracker.c -> build\tracker.dll...
tracker.c
   Creating library build\tracker.lib and object build\tracker.exp
Build succeeded: build\tracker.dll

[Validation Warning] Skipping malformed record: { day: 'Wednesday', steps: 'invalid_data' }
--- Pipeline Execution Complete (Goal: > 10000 steps) ---
Successful Days: Monday (12450), Thursday (15200), Sunday (11200)
Successful Days Count: 3
Cumulative Steps (Calculated via C Pointers): 38850

```

### Custom Goal (`npm start -- data/steps.json 8000`)

```text
[Validation Warning] Skipping malformed record: { day: 'Wednesday', steps: 'invalid_data' }
--- Pipeline Execution Complete (Goal: > 8000 steps) ---
Successful Days: Monday (12450), Tuesday (8300), Thursday (15200), Friday (10000), Sunday (11200)
Successful Days Count: 5
Cumulative Steps (Calculated via C Pointers): 57150

```

## Author

Harry Eliki

```

```
