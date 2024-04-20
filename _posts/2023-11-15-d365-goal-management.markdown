---
layout: post
comments: true
title:  "Dynamics 365 Goal Management"
date:   2023-11-10 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Dataverse, Dynamics, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Dynamics 365 Goal Management"
    facebook: "Dynamics 365 Goal Management"
    linkedin: "Dynamics 365 Goal Management"
---

## Business Scenarios
### Sales Goals
- Sales goal achievement by region, for example, north, south.

### Customer Service Goals
- Internal customer service team vs partner customer service team

### Goal
- It has the aggregated data of the goal, such as the target, actual and in-progress.
- It has has a single lookup field to a Metric record.
- It has a lookup field to the "Rollup Query Actual(Money)" and ""Rollup Query In-Progress(Money)" respectively. The **rollup queries** has direct effect on the participating records. 
- It defines the goal owner and goal manager.

![image](../images/2023-11-15-d365-goal-management/goal-metric-lookup.png)

![image](../images/2023-11-15-d365-goal-management/goal-time-period.png)

![image](../images/2023-11-15-d365-goal-management/goal-rollup-queries.png)

![image](../images/2023-11-15-d365-goal-management/goal-participating-records.png)

### Goal Metric
One Goal Metric record can have maximum 3 rollup fields (one per type below):
- In-Progress (e.g., Money, Integer, Decimal)
- Custom (e.g., Money, Integer, Decimal)
- Actual (e.g., Money, Integer, Decimal)

And you can not have duplicate Goal Metric records.

The Goal Metric records control at the roll up level.

![image](../images/2023-11-15-d365-goal-management/goal-metric-lookup.png)

### Rollup Field Records
These records control goal rollups at fields level. For example, one will want to rollup data on the number of cases resolved. Please note that you don't define the time period here, rather you will pick with field determines the time period. 

![image](../images/2023-11-15-d365-goal-management/goal-rollup-field.png)

## FAQs
Q: What defines the time period for the goal rollups?
A: Goal > Time Period > the From field and the To field
![image](../images/2023-11-15-d365-goal-management/goal-time-period.png)

Q: What defines the participating records for a goal?

A: 
- Goal > Rollup Query: For example, opportunity from the northen sales team.
- Goal > Time Period > the From field and the To field.
- Rollup Field > Date field.
