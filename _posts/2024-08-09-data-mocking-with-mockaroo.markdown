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
You can't really test your app without underlining data. 

## Data Mocking Approach for Dynamics 365
Power Automate for heavy lifting logics, like create relationships for data dependencies.

Mockaroo will generate realistic names for contacts and account.

### How Can Power Automate Work with Mockaroo?
Once you created your Mockaroo schemas, you can wrap it with web APIs, and Power Automate flows can call Mockaroo web APIs for data.

## Mockaroo Project Structure
On the top level, you have Mockaroo project, and each project consists of schemas, datasets, APIs, and scenarios.

## Mockaroo Scenarios
### Custom List Type
It is equivalent to optionset in Dataverse. When define a Mockaroo schema, simply select the field type to be "Custom List", and comma split values of each list value.

```
Car, Railway, Flight
```

### Guid Type
If you create a D365 record with a pre-defined GUID as its primary key. You can use it as the foreign key value when creating depending records so that your data mocking logic will have better performance.

### Auto ID
https://forum.mockaroo.com/t/how-to-create-a-custom-row-number/1704 

### Formulas
Formulas are similar to a calculated field/column in Dataverse.

```ruby
concat(first_name, " ", last_name)
```

source: https://www.mockaroo.com/help/formulas

#### concat

#### padding
The formula below will generate row IDs using concatenation and padding. Here is an example of its output value:  CAS-0000000001 
```ruby
concat('CAS-', pad(field("row_id"), 10, "0", "left"))
```

### Functions
Functions allow more complex logic than formulas
```ruby
# Returns the length of the provided string
length = lambda do |str|
  str.length
end
```

```ruby
# consumption of the function
length.call(first_name)
```

## Performance
The power automate + mockaroo combination can import 1500 records every minute, whereas data flows can pump in 15,000 records per minute.

## Mockaroo License and User Account
Mockaroo has four license tiers: Free, Silver, Gold, and Enterprise.

A free tier Mockaroo user is allowed 200 API requests per day and each request can contain 1000 rows of data.

For more details, please refer to their [pricing page](https://www.mockaroo.com/pricing).

