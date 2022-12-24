---
layout: post
comments: true
title:  "NoSQL CosmosDB MongoDB Learning Notes"
date:   2022-12-23 08:00:00 +0800
categories: Technology
tags: [Microsoft, Azure, Azure China, NoSQL, CosmosDB, MongoDB, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "NoSQL CosmosDB MongoDB Learning Notes"
    facebook: "NoSQL CosmosDB MongoDB Learning Notes"
    linkedin: "NoSQL CosmosDB MongoDB Learning Notes"
---

## Why NoSQL?
Traditional SQL databases are good at processing complex queries very efficiently. However, when it comes to the 3V (Volume, Velocity, Variety), we need a new platform.

NoSQL databases are designed to handle large volumes of data that may have a high velocity of incoming and outgoing data, as well as a variety of data types and structures. This makes them useful for organizations with multiple data streams and large amounts of data that need to be processed and stored. For example, I saw some really big companies use NoSQL databases as the base of their master data system (MDS).

## Concepts
In a NoSQL **database**, data is organized into **containers**, which can be divided into **partitions** based on a shard key. It is important to choose a shard key that will result in an **even distribution** of data across servers, and that is frequently used in queries. The db.collection.getShardDistribution() command can be used to view the distribution of data across servers and determine the effectiveness of the shard key. For example, country is probably a better shard key then the ID field.

You can use the db.collection.getShardDistribution() command to view the distribution of data across the servers and to help you determine if your shard key is effective.

## APIs
Azure CosmosDB offers a variety of APIs for interacting with the database, including SQL, MongoDB, Table, Gremlin, and Cassandra. The SQL API is the most powerful, but developers familiar with MongoDB or Cassandra may prefer to use the corresponding APIs. The Table API is compatible with Azure Table Storage, and the Gremlin API is a graph API.

## Clients
To access and query data in an Azure CosmosDB resource, users can use the Azure Portal's Data Explorer or tools like Robo 3T or Studio 3T (for the MongoDB API).
