---
layout: post
comments: true
title:  "Query Mongo DB"
date:   2023-06-29 08:00:00 +0800
categories: Technology
tags: [Azure, Azure Function App, Database, NoSQL,Authentication, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Query Mongo DB"
    facebook: "Query Mongo DB"
    linkedin: "Query Mongo DB"
---

## Difference between MongoDB and Cosmos DB
CosmosDB and MongoDB are both popular database management systems, but they have some key differences that set them apart.

One of the main differences between CosmosDB and MongoDB is their underlying architecture. **CosmosDB is a fully managed**, globally distributed database service that is built on top of Microsoft's Azure cloud platform. It uses a multi-model approach, which means that it can support multiple data models, such as document, key-value, and graph, within a single database. **MongoDB, on the other hand, is an open-source database system** that uses a document-oriented data model.

Another key difference between the two databases is their scalability and performance. **CosmosDB is designed to be highly scalable and offers automatic and transparent scaling of both throughput and storage**. It also provides guaranteed low latencies for read and write operations. MongoDB, on the other hand, does not offer the same level of scalability and performance guarantees. It relies on manual sharding to scale horizontally, which can be more complex to set up and manage.

Finally, CosmosDB and MongoDB differ in their pricing models. CosmosDB uses a pay-per-use model, where you only pay for the resources you consume. MongoDB, on the other hand, offers both a free open-source version and a paid enterprise version, which includes additional features and support.

Overall, CosmosDB and MongoDB are both powerful database management systems, but they are designed for different use cases and have different strengths and weaknesses. To determine which one is the best fit for your needs, you should carefully evaluate your specific requirements and consider factors such as scalability, performance, and cost.

## What is a Azure Cosmos DB API for MongoDB account?
**The Azure Cosmos DB API for MongoDB is a type of Azure Cosmos DB account that is specifically designed to be compatible with the MongoDB database management system. It allows you to use the MongoDB application programming interface (API) to access and manipulate data stored in Azure Cosmos DB.** This can be useful if you have an existing application that uses MongoDB and want to take advantage of the global distribution, scalability, and low-latency performance of Azure Cosmos DB.

An Azure Cosmos DB API for MongoDB account is created in the same way as any other Azure Cosmos DB account, but it requires you to select the "MongoDB" option when configuring the API for the account. Once the account is created, you can connect to it using the MongoDB client of your choice and use the MongoDB API to interact with the data. Azure Cosmos DB API for MongoDB accounts support all of the core features of Azure Cosmos DB, such as automatic and transparent scaling, global distribution, and multi-model support.

Overall, an Azure Cosmos DB API for MongoDB account is a useful option if you want to use Azure Cosmos DB to power your MongoDB-based applications. It allows you to take advantage of the benefits of Azure Cosmos DB while still using the MongoDB API and client tools that you are familiar with.

## Why Should You Use a NoSQL Database?
NoSQL databases are a popular choice for many applications because they offer several key advantages over traditional relational databases. Here are some of the main reasons why you should consider using a NoSQL database for your next project: Volume, Velocity, and Variety.

### Volume > Shard Key for Partition
It's important to choose a shard key that will result in an even distribution of data across the servers. A good shard key should have a high number of unique values and should be frequently used in queries. For example, country is a good field for sharding but ID is not.

You can use the db.collection.getShardDistribution() command to view the distribution of data across the servers and to help you determine if your shard key is effective.

## Technical Details
### Sorting Filtering and Get First in MongoDB
```CSharp
using MongoDB.Driver;
```

```CSharp
        public async Task<Offer> GetOfferAsync(string offerNumber, OfferStage offerStage)
        {
            var offerNumberFieldDefinition = new ExpressionFieldDefinition<Offer, string>(x => x.OfferNumber);
            var filterByOfferNumber = Builders<Offer>.Filter.Eq(offerNumberFieldDefinition, offerNumber);
            var filterByOfferStage = Builders<Offer>.Filter.Eq("stage", offerStage.GetDescription());
            var combinedFilter = filterByOfferNumber & filterByOfferStage;
            var item = await _collection.Find(combinedFilter)
                                        .SortByDescending(d => d.CreatedOn)
                                        .Limit(1)
                                        .FirstOrDefaultAsync();
            return item;
        }
```

### Indexing in CosmosDB
The primary reasons for creating indexes are:
1. Query Performance: Indexes greatly enhance the speed and efficiency of queries. Without an index, Cosmos DB might need to scan the entire collection to find the documents matching your query – this is a slow and expensive process, especially as your dataset grows. With an index, the database can quickly locate those documents, leading to significantly faster results.

2. Reduced Request Units (RU) Consumption: Request Units (RUs) are the currency for throughput in Cosmos DB.  Queries that utilize indexes consume fewer RUs than queries without. This means indexes can make your application more cost-effective.

Understanding common index use cases will aid in designing an effective indexing strategy. Common Index Examples:

Partition Key: In Cosmos DB, data is partitioned, and indexing the partition key is generally recommended. Queries that filter by the partition key benefit significantly from this index.

High-Cardinality Fields: Fields with many distinct values (e.g., user IDs, product SKUs, timestamps) are good index candidates. These fields help refine queries more effectively.

### Tooling
- Robo 3T: A popular GUI for MongoDB that allows you to interact with your databases visually. It provides a user-friendly interface for querying, managing, and visualizing your data.

- Azure Cosmos DB API for MongoDB Data Explorer: A web-based tool provided by Azure that allows you to interact with your Azure Cosmos DB API for MongoDB account. It provides a similar experience to Robo 3T but is hosted in the Azure portal.

### Querying in MongoDB
Absolutely! Here's a quick introduction to MongoDB query syntax:

**Basic Structure**

MongoDB queries are primarily represented by JSON-like documents. A basic query looks like this:

```javascript
db.collectionName.find({ <query criteria> })
```

* `db.collectionName`: Specifies the database and collection you're targeting.
* `<query criteria>`: Defines the conditions documents must match to be returned.

**Query Criteria**

* **Equality Match:**
   ```javascript
   { field: "value" }  // Matches documents where 'field' has the exact 'value' 
   ```
* **Not Equality Match:**
   ```javascript
   { field: { $ne: "value"} }  // Matches documents where 'field' has the exact 'value' 
   ```
   Example for retrieving all offers that are not in the "invited" stage:
   ```javascript
   db.getCollection('offers').find({ stage: { $ne: "invited" } })
   ```
* **Comparison Operators:**
   ```javascript
    { field: { $gt: 10 } } // 'field' greater than 10
    { field: { $lt: 5 } } // 'field' less than 5
    { field: { $gte: 7 } } // 'field' greater than or equal to 7
    { field: { $lte: 9} } // 'field' less than or equal to 9
   ```
* **Logical Operators:**
   ```javascript
   { $and: [ { price: { $gt: 10 } }, { category: "electronics" } ] } // Both conditions must match
   { $or: [ { price: { $lt: 5 } }, { quantity: 0 } ] } // Either condition can match
   ```

**Additional Operators**

MongoDB has a rich set of query operators:

 * **Array Operators:** `$in`, `$all`, etc. (for working with fields containing arrays)
 * **Text Search:** `$search` (for text-based queries)
 * **Geospatial Queries:** `$near`, `$geoWithin` (for location-based data)

**Projections**

To limit the fields returned in your results:

```javascript
db.collectionName.find({ <query criteria> }, { <field1>: 1, <field2>: 1, ... })
```
* Include fields by setting them to `1` in the projection document.

**Example**

```javascript
db.inventory.find({ 
    status: "A", 
    $or: [ { quantity: { $lt: 20 } }, { price: { $gte: 100 } } ] 
})
```
This finds documents where 'status' is "A" AND (quantity is less than 20 OR price is greater than or equal to 100).


