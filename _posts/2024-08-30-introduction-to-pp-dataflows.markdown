---
layout: post
comments: true
title:  "An Introduction to Power Platform Dataflows"
date:   2024-08-30 08:00:00 +0800
categories: Technology
tags: [Power Platform, Dataflow, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "An Introduction to Power Platform Dataflows"
    facebook: "An Introduction to Power Platform Dataflows"
    linkedin: "An Introduction to Power Platform Dataflows"
---

## What is Power Platform Dataflow?
Dataflows in Microsoft Power Platform empower users to ingest, transform, and load data into Microsoft Dataverse environments. This tool is essential for consolidating, cleaning, and preparing data from various sources for use in applications built on Dataverse.

## User Scenarios
Power Platform Dataflows are commonly used in the following scenarios:

* **Data Migration from Legacy Systems**: Easily transfer data from legacy systems to Dataverse.
* **Building Dimensional Models**: Consolidate different transactional data sources into a structured dimensional model.
* **Loading Synthetic Data in Volume**: Generate and load large volumes of synthetic data for testing or training machine learning models.

## Technical Overview
### How to Create a Dataflow
To create a new Dataflow in Power Platform, go to New -> Automation -> Dataflow.
![image](../images/2024-08-30-data-flow-101/create-dataflow.png)

### Basic Components of a Dataflow
Each Dataflow consists of several key components:

* Data Sources: Specify the origin(s) of your data, such as databases, files, or APIs.
* Queries (Location 1 in the screenshot below): Define queries that pull in data from your sources.
* Data Transformation Steps (Location 2 in the screenshot below): Define transformations like filtering, cleaning, or restructuring data using Power Query.
* Query Results Preview (Location 3 in the screenshot below): See a preview of the transformed data.
* Data Mapping: Map the transformed data to the correct fields in Dataverse.

![image](../images/2024-08-30-data-flow-101/power-query.png)

![image](../images/2024-08-30-data-flow-101/data-map.png)

### Query Execution Order
In a Dataflow, multiple queries are executed in the order they appear in the setup. This sequential execution ensures that any dependencies between queries are handled correctly.

### Data Mapping Considerations
#### Mapping Lookup Fields
For Lookup fields, use the alternative key on the referenced table to establish the relationship properly.

![image](../images/2024-08-30-data-flow-101/alternative-key.png)

#### Mapping Option Sets
When mapping to option sets, you need to specify the option set value (which is a numeric type) rather than the display name.

### Mapping Owner Field
Dataflows cannot assign records to different owners dynamically. All records created via a Dataflow will be owned by the owning user of the Dataflow.

### Dataflow Rules and Limitations
Single Table Import: You cannot import data into the same destination table more than once in a single dataflow. If you need to update different columns, you must separate the operations into different dataflows.

### Data Runs/Refreshes
In Dataflows, data executions are referred to as refreshes.

#### Refresh Triggers
You have two options for triggering a data refresh:

* Manual Refresh: Trigger a refresh manually by clicking on the "Refresh" button.
![image](../images/2024-08-30-data-flow-101/dataflow-manual-refresh.png)

* Automatic Refresh: Set up a recurring schedule for automatic data refreshes through the refresh settings.
![image](../images/2024-08-30-data-flow-101/dataflow-auto-refresh.png)

#### Refresh History
The refresh history provides logs of all past refreshes, helping you track data runs and troubleshoot any issues.
![image](../images/2024-08-30-data-flow-101/dataflow-refresh-history-action-logs.png)

## Performance Insights
### Power Automate Flow Performance
Using Power Automate to move data yields the following approximate throughput:

* 30 records per minute for a single flow.
* 60 records per minute if running two Power Automate flows in parallel.

### Dataflow Performance
Dataflows generally offer much better performance:

* Approximately 15,000 records per minute with two Dataflow jobs running in parallel.

## References
* https://learn.microsoft.com/en-us/power-query/dataflows/overview-dataflows-across-power-platform-dynamics-365
* https://learn.microsoft.com/en-us/power-query/add-custom-column