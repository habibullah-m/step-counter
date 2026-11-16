# Step Counter Project Pseudocode

```text
START

  Read the optional data file path from command-line arguments
  If no path was provided:
    Use the default steps JSON file

  Read the optional step goal from command-line arguments
  If no valid goal was provided:
    Use 10,000 steps

  Load and parse the JSON data

  If the data is not a list:
    Stop with an input error

  Create an empty list of valid records

  FOR each record in the data:
    IF record has a text day name
       AND record has a numeric, non-negative step count:
      Add record to the valid records
    ELSE:
      Warn that the record was skipped

  Create a filter that checks whether a record's steps exceed the goal
  Keep only valid records that pass the filter

  Copy the successful step counts into a contiguous integer array

  Pass the array and its length to the C function

  In the C function:
    Set total steps to zero
    Set a pointer to the start of the array
    WHILE the pointer has not reached the end:
      Add the current step count to the total
      Advance the pointer
    Return the total

  Print the goal, successful days, number of successful days,
  and cumulative steps

END
```
