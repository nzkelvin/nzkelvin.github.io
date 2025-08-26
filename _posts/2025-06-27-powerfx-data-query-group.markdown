---
layout: post
comments: true
title:  "PowerFx Data Query Grouping"
date:   2025-06-27 08:00:00 +0800
categories: Technology
tags: [AI, Twitter, Facebook, LinkedIn]
sharing:
    twitter: ""
    facebook: ""
    linkedin: ""
---

### Grouping Example
```
// Does not work
ClearCollect(
    colEmployeesGrouped,
    ForAll(
        Distinct(colEmployees, Department),
        With(
            {
                currentDept: ThisRecord.Value,
                matchingRecords: Filter(colEmployees, Department = ThisRecord.Department)
            },
            {
                currentDeptTest: currentDept,
                matchingRecordsTemp: matchingRecords,
                matchingRecordsCount: CountRows(matchingRecords)
             }
        )
    )
);
```

```
// Works
ClearCollect(
    colEmployeesGrouped,
    ForAll(
        Distinct(colEmployees, Department),
        With(
            {
                currentDept: ThisRecord.Value
            },
            {
                Department: First(Filter(colEmployees, Department = currentDept)).Department,
                EmployeeNames: Concat(Filter(colEmployees, Department = currentDept), FullName, "; "),
                JobTitles: Concat(Filter(colEmployees, Department = currentDept), JobTitle, "; ")
             }
        )
    )
);
```

The top code snippet doesn't work is because ThisRecord.Department doesn't exist. It will not throw any errors but you will get empty collection rather than expected data. 

The problematic code 
```
Filter(colEmployees, Department = ThisRecord.Department)
```

To fix it, use ThisRecord.Value instead.
```
Filter(colEmployees, Department = ThisRecord.Value)
```

So, the takeaway from this is when looping with ForAll, the current record context is super important, i.e. This Record.

### ThisRecord example
```
ClearCollect(
    colPartiesGrouped,
    ForAll(
        Distinct(colCaseParties, CasePartyOriginCombined),
        With(
            {
                currentOrigin: ThisRecord.Value,
                matchingRecords: Filter(colCaseParties, CasePartyOriginCombined = ThisRecord.Value)
            },
            {
                CasePartyOriginCombined: First(Filter(colCaseParties, CasePartyOriginCombined = currentOrigin)).CasePartyNameCombined,
                CasePartyRoleNames: Concat(Filter(colCaseParties, CasePartyOriginCombined = currentOrigin), CasePartyRoleName, "; "),
                CasePartyLawyerNames: Concat(Filter(colCaseParties, CasePartyOriginCombined = currentOrigin), CasePartyLawyerName, "; ")
             }
        )
    )
);
````

The value of ThisRecord changes depend on the scope.

```
currentOrigin: ThisRecord.Value 
```
The scope of ThisRecord is Distinct(colCaseParties, CasePartyOriginCombined)

```
matchingRecords: Filter(colCaseParties, CasePartyOriginCombined = ThisRecord.Value)
```
The scope of ThisRecord is colCaseParties

### Nested With
```
ClearCollect(
    colPartiesGrouped,
    ForAll(
        Distinct(colCaseParties, CasePartyOriginCombined),
        With(
            {
                currentOrigin: ThisRecord.Value,
                matchingRecords: Filter(colCaseParties, CasePartyOriginCombined = currentOrigin)
            },
            {
                CasePartyOriginCombined: First(Filter(colCaseParties, CasePartyOriginCombined = currentOrigin)).CasePartyNameCombined,
                CasePartyRoleNames: Concat(Filter(colCaseParties, CasePartyOriginCombined = currentOrigin), CasePartyRoleName, "; "),
                CasePartyLawyerNames: Concat(Filter(colCaseParties, CasePartyOriginCombined = currentOrigin), CasePartyLawyerName, "; ")
             }
        )
    )
);
```
The above code will not work because of currentOrigin is not recognized inside Filter(colCaseParties, CasePartyOriginCombined = currentOrigin).

```
ClearCollect(
    colPartiesGrouped,
    ForAll(
        Distinct(colCaseParties, CasePartyOriginCombined),
        With(
            {
                currentOrigin: ThisRecord.Value
            },
            With(
                {
                    matchingRecords: Filter(colCaseParties, CasePartyOriginCombined = currentOrigin)
                },
                {
                    CasePartyOriginCombined: First(Filter(colCaseParties, CasePartyOriginCombined = currentOrigin)).CasePartyNameCombined,
                    CasePartyRoleNames: Concat(Filter(colCaseParties, CasePartyOriginCombined = currentOrigin), CasePartyRoleName, "; "),
                    CasePartyLawyerNames: Concat(Filter(colCaseParties, CasePartyOriginCombined = currentOrigin), CasePartyLawyerName, "; ")
                }
            )
        )
    )
);
```
The above code works


```
ClearCollect(
    colPartiesGrouped,
    ForAll(
        Distinct(colCaseParties, CasePartyOriginCombined),
        With(
            {
                currentOrigin: Value,
                matchingRecords: Filter(colCaseParties, Value = ThisRecord.CasePartyOriginCombined)
            },

                {
                    CasePartyOriginCombined: First(matchingRecords).CasePartyNameCombined,
                    CasePartyRoleNames: Concat(matchingRecords, CasePartyRoleName, "; "),
                    CasePartyLawyerNames: Concat(matchingRecords, CasePartyLawyerName, "; ")
                }
            
        )
    )
);
```
Works



```
ClearCollect(
    colPartiesGrouped,
    ForAll(
        Distinct(colCaseParties, CasePartyOriginCombined) As DistinctCaseParties,
        With(
            {
                currentOrigin: DistinctCaseParties[@Value],
                matchingRecords: Filter(colCaseParties, ThisRecord.CasePartyOriginCombined = DistinctCaseParties[@Value])
            },

                {
                    CasePartyOriginCombined: First(matchingRecords).CasePartyNameCombined,
                    CasePartyRoleNames: Concat(matchingRecords, CasePartyRoleName, "; "),
                    CasePartyLawyerNames: Concat(matchingRecords, CasePartyLawyerName, "; ")
                }
            
        )
    )
);
```
Works with a disambiguation operator.

Record scope is for each record of a loop function like Filter.

Value is a special field for single columns data table sources.

ThisRecord symbol is for the most immidiate data context. 

## References
* [](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/working-with-tables#record-scope)