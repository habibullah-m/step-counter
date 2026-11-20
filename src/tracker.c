#include <stdio.h>
#include <stdlib.h>

#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT
#endif

// Exported function for FFI / Shared Library integration
EXPORT long long calculateCumulativeSteps(const int *stepsArray, int size) {
    long long totalSteps = 0;
    const int *ptr = stepsArray;
    const int *end = stepsArray + size;

    // Traverse array using pointer arithmetic
    while (ptr < end) {
        totalSteps += *ptr;
        ptr++;
    }

    return totalSteps;
}

// Standalone execution entrypoint for testing C independently
int main() {
    int successfulSteps[] = {12450, 15200, 10000, 11200};
    int count = sizeof(successfulSteps) / sizeof(successfulSteps[0]);

    long long cumulativeTotal = calculateCumulativeSteps(successfulSteps, count);
    printf("C Engine - Cumulative Successful Steps: %lld\n", cumulativeTotal);

    return 0;
}
