---
layout: post
comments: true
title:  "Data Mocking with Mockaroo"
date:   2024-08-09 08:00:00 +0800
categories: Technology
tags: [PowerShell, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Data Mocking with Mockaroo"
    facebook: "Data Mocking with Mockaroo"
    linkedin: "Data Mocking with Mockaroo"
---

## Why Data Mocking?

Let's face it: you can't thoroughly test your Dynamics 365 applications without realistic data.  Manually creating sample records is tedious and often doesn't accurately reflect real-world scenarios. That's where data mocking comes in. It allows you to generate large volumes of credible data that mimics the complexity and nuances of your actual data, enabling comprehensive testing and development.

## Data Mocking Approach for Dynamics 365: A Powerful Combination

This blog post explores a robust approach to data mocking for Dynamics 365, leveraging the strengths of two powerful tools: **Power Automate** and **Mockaroo**.

**Power Automate** takes care of the heavy lifting, orchestrating the data generation process and handling complex logic like establishing relationships between records (e.g., linking contacts to accounts).

**Mockaroo** excels at generating realistic and varied data, from names and addresses to product descriptions and financial figures.  

### How Can Power Automate Work with Mockaroo?

Mockaroo allows you to define data schemas and generate datasets based on those schemas.  By exposing these datasets through web APIs, you can seamlessly integrate them with Power Automate. Your Power Automate flows can then call these APIs to retrieve the mock data and populate your Dynamics 365 environment.

## Mockaroo Project Structure

A typical Mockaroo project is organized into:

* **Schemas:** Define the structure of your data, including field names, data types, and constraints.
* **Datasets:** Collections of generated data based on your schemas.
* **APIs:**  Endpoints for accessing your datasets programmatically.
* **Scenarios:**  Predefined configurations for generating data with specific characteristics.

## Mockaroo Features for Realistic Data

Mockaroo offers a range of features to create highly realistic and customizable mock data:

### Custom List Type

Similar to option sets in Dataverse, the "Custom List" field type lets you define a set of allowed values. Simply list the values, separated by commas:

```
Car, Railway, Flight
```

### GUID Type

Generating GUIDs within Mockaroo simplifies the creation of related records. By using predefined GUIDs as primary keys, you can reference them as foreign keys in related entities, ensuring data integrity and efficient processing.

### Auto ID

Mockaroo provides ways to generate sequential IDs or row numbers within your datasets. You can achieve this using formulas or by leveraging the `row_id` field in conjunction with the `pad` function (see the Formulas section below).

### Formulas

Formulas in Mockaroo are akin to calculated fields in Dataverse. They allow you to dynamically generate values based on other fields or expressions.  

For instance, to combine first and last names:

```ruby
concat(first_name, " ", last_name)
```

#### Concatenation and Padding

To generate formatted IDs (e.g., order numbers), you can combine the `concat` and `pad` functions:

```ruby
concat('CAS-', pad(field("row_id"), 10, "0", "left")) 
```
This formula produces IDs like `CAS-0000000001`.

### Functions

For more complex logic, Mockaroo supports custom functions written in Ruby.  

Here's an example of a function that calculates the length of a string:

```ruby
# Returns the length of the provided string
length = lambda do |str|
  str.length
end
```

You can then use this function within your schema:

```ruby
# consumption of the function
length.call(first_name)
```

## Performance Considerations

While the Power Automate and Mockaroo combination offers flexibility and ease of use, it's essential to consider performance, especially for large datasets.  In our experience, this approach can import approximately 1,500 records per minute. For higher throughput (around 15,000 records per minute), Dataverse dataflows might be a more efficient option. In other words, the Power Automate and Mockaroo combination is ideal for development scenarios because of its flexibility and easy of use, whereas Dataverse dataflows are great for stress test when large amount of data is required.

## Mockaroo License and User Account

Mockaroo offers different licensing tiers to suit various needs: Free, Silver, Gold, and Enterprise. The free tier provides a good starting point with 200 API requests per day, each allowing up to 1,000 rows of data.  For larger projects or increased usage, you can explore the higher tiers.  Refer to the [Mockaroo pricing page](https://www.mockaroo.com/pricing) for detailed information.

## Conclusion

By combining the power of Mockaroo and Power Automate, you can streamline the creation of realistic test data for your Dynamics 365 applications. This approach enables comprehensive testing, accelerates development cycles, and ultimately leads to higher quality solutions.
