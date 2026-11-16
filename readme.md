# Fitness Goal Achievement and Cumulative Activity Tracker

A hybrid **JavaScript (Node.js ESM)** and **C** application that validates daily step logs, filters days meeting a configurable activity goal using a JavaScript closure factory, and delegates cumulative step calculation to a compiled C engine using pointer arithmetic.

## Overview & Architecture

The processing pipeline is split across two layers connected via **Koffi** (Foreign Function Interface):

1. **Data Validation & Closure Filtering (`src/tracker.js`)**
   - `validateStepData(rawData)` filters out malformed records (missing fields, non-numeric step counts, `NaN`, or negative numbers) and logs warnings for rejected entries.
   - `createGoalFilter(targetSteps)` acts as a **closure factory**, capturing `targetSteps` in its lexical scope and returning a reusable predicate function to filter days that meet or exceed the goal.

2. **Pointer-Based Cumulative Engine (`src/tracker.c`)**
   - Exposes `calculateCumulativeSteps(const int *stepsArray, int size)` as a native shared library export (`__declspec(dllexport)` on Windows).
   - Iterates across the memory buffer using pointer bounds (`ptr < end`) and pointer dereferencing (`*ptr`) rather than array indexing.

3. **FFI Bridge (`src/main.js`)**
   - Extracts filtered step counts into a contiguous `Int32Array` buffer and passes its pointer directly to `build/tracker.dll`.

## Project Structure

```text
step-counter/
├── src/
│   ├── tracker.c      # C cumulative step calculator using pointer arithmetic
│   ├── tracker.js     # JS input validator and goal closure factory (ESM)
│   └── main.js        # Entrypoint bridging JS and C via Koffi FFI
├── build/             # Generated DLL, OBJ, LIB, and EXP build artifacts
├── build.ps1          # PowerShell build script invoking MSVC (cl.exe)
└── package.json       # Project metadata, dependencies, and npm scripts
```

## Prerequisites

- **OS:** Windows (x64)
- **Runtime:** [Node.js](https://nodejs.org/) v20+ (tested on Node v24.19.0)
- **Compiler:** Microsoft Visual Studio / Build Tools with the **MSVC C/C++ x64** toolset (`cl.exe` and `vswhere.exe`)

## Installation & Usage

1. **Install dependencies:**

```powershell
npm install

```

2. **Build the C DLL and run the tracker:**

```powershell
npm run dev

```

### Available Scripts

| Command         | Description                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `npm run build` | Locates Visual Studio via `vswhere.exe`, loads `vcvars64.bat`, and compiles `src/tracker.c` into `build/tracker.dll`. |
| `npm start`     | Runs `src/main.js` against the compiled `build/tracker.dll`.                                                          |
| `npm run dev`   | Compiles the C shared library and immediately runs the Node.js pipeline.                                              |

## Sample Output

```text
> step-counter@1.0.0 dev
> npm run build && npm start

Compiling src\tracker.c -> build\tracker.dll...
tracker.c
   Creating library build\tracker.lib and object build\tracker.exp
Build succeeded: build\tracker.dll

[Validation Warning] Skipping malformed record: { day: 'Wednesday', steps: 'invalid_data' }
--- Pipeline Execution Complete ---
Successful Days Count: 4
Cumulative Steps (Calculated via C Pointers): 48850

```

## Author

Harry Eliki

```

```
