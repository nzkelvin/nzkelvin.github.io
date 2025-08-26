---
layout: post
comments: true
title:  "Join Tables in PowerFX"
date:   2025-04-03 08:00:00 +0800
categories: Technology
tags: [AI, Twitter, Facebook, LinkedIn]
sharing:
    twitter: ""
    facebook: ""
    linkedin: ""
---

### Nested Galleries
Multiple Gallery will lead to multiple scrolls in the 2nd level which is nasty. 

However, two dimension nested gallery may work, i.e. level 1 gallery goes from left to right, and level 2 gallery goes from top to bottom.

### Single Gallery with Grouped Items
Use a single gallery with [grouped items technique](https://www.matthewdevaney.com/group-the-items-in-a-power-apps-gallery/)


### Data Join - The ForAll Technique
Using ForAll return nothing
```
ForAll(
    colAppEvents,
    Collect(
        colAppParties,
        Filter(
            'Application Parties',
            ThisRecord.Application.Application = Application.Application
        )
    )
);
```

Using ForAll with Alias for the outer loop
```
ForAll(
    colAppEvents As appEvent,
    Collect(
        colAppParties,
        Filter(
            'Application Parties',
            ThisRecord.Application.Application = appEvent.Application.Application
        )
    )
);
```

Using ForAll with With. With establish a temp variable
```
ForAll(
    colAppEvents,
    With(
        {currentApp: ThisRecord.Application.Application},
        Collect(
            colAppParties,
            Filter(
                'Application Parties',
                ThisRecord.Application.Application = currentApp
            )
        )
    )
)
```

### Data Join - The Ungroup Technique
[JOIN All Columns From Another Collection](https://www.matthewdevaney.com/powerapps-collections-cookbook/join-all-columns-from-another-collection/)

### Scope Ambiguity
[Power Fx explained: Record scope, scope ambiguity and disambiguation](https://laurensm.com/power-fx-explained-record-scope-scope-ambiguity-and-disambiguation/)

### Single Quote vs Double Quote

SortByColumns is still using double quote to specify columns whereas AddColumns is using single quote to specify columns, or no quote if the column name has no spaces or speical characters.

[Power Fx: Column names escape double quotes](https://www.microsoft.com/en-us/power-platform/blog/power-apps/power-fx-no-more-columns-names-in-text-strings/)