---
layout: post
comments: true
title:  "Query Mongo DB"
date:   2023-06-29 08:00:00 +0800
categories: Technology
tags: [Azure, Azure Function App, Database, NoSQL,Authentication, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Implementing Approval Processes in Power Automate"
    facebook: "Implementing Approval Processes in Power Automate"
    linkedin: "Implementing Approval Processes in Power Automate"
---

### Difference between MongoDB and Cosmos DB


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

### Indexing in MongoDB

