---
layout: post
comments: true
title:  "Optimizing Dynamics 365 Queries: Late-Bound Entities, LINQ, Query Expressions"
date:   2023-10-13 08:00:00 +0800
categories: Technology
tags: [Microsoft, D365, PowerPlatform, Dataverse, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Optimizing Dynamics 365 Queries: Late-Bound Entities, LINQ, Query Expressions"
    facebook: "Optimizing Dynamics 365 Queries: Late-Bound Entities, LINQ, Query Expressions"
    linkedin: "Optimizing Dynamics 365 Queries: Late-Bound Entities, LINQ, Query Expressions"
---
Dynamics 365 developers work with both early-bound and late-bound entities.  Understanding the trade-offs between these is crucial for efficient coding. In this post, I'll explore the nuances of late-bound entities, how to navigate LINQ's limitations, and strategies to make your Dynamics 365 queries robust.

## Late-Bound vs. Early-Bound Entities in Dynamics 365

Late-bound entities in Dynamics 365 offer slightly improved performance, but early-bound entities provide compile-time checking and better IntelliSense support. Here's a quick comparison:

**Early-bound**                                     |  **Late-bound** 
-------------------------------------------------- | --------------------------------------------
Compile-time verification of names                 | No compile-time verification
Must generate entity classes                       | No need to generate classes
Better IntelliSense support                        | Less IntelliSense support
Slightly less performant                           | Slightly more performant

**Reference:** https://learn.microsoft.com/en-us/power-apps/developer/data-platform/org-service/early-bound-programming

## LINQ to D365 with late-bound entities in Dynamics 365
### The Challenge of Anonymous Types
When using LINQ queries with late-bound entities, projecting results into anonymous types poses an update challenge. These anonymous types lack the entity logical name and ID that Dynamics 365 needs to perform updates.

```csharp
// Query to get necessary data (for illustration, not ideal for updates)
var query = (from pa in context.CreateQuery(kys_portalaccess.EntityName)
             where /* your conditions */
             select new
             {
                 Id = pa.Id, 
                 // ...other attributes
             }).FirstOrDefault(); 

```
### Working Directly with Entity Objects
For updates, retrieve the full Entity object within your LINQ query:
```csharp
var msAuthPortalAccessEntity = (from pa in context.CreateQuery(kys_portalaccess.EntityName)
                                where /* your conditions */
                                select pa).FirstOrDefault();

if (msAuthPortalAccessEntity != null)
{
    msAuthPortalAccessEntity["attribute_to_update"] = "new value";
    service.Update(msAuthPortalAccessEntity);
}

```
Performance Note: Retrieving entity objects leads to retrieving all columns, which can impact performance, especially with entities having a large number of attributes or large data volumes. To cherry pick the exactly columns, we have to revert back to anonymous types, which is a pain if following-up update is required. 

While LINQ provides familiar syntax, Query Expressions often prove more suitable for initial Dynamics 365 data retrieval due to their flexibility and performance focus.

## Combining Query Expressions with LINQ to Objects
Once you've fetched records with a Query Expression, you can streamline further filtering using LINQ to Objects:

```csharp
                var existingGroupEmailPortalAccess = relatedGroupEmailPortalAccess.Entities
                    .FirstOrDefault(pa =>
                    {
                        return pa.Contains(kys_portalaccess.kys_contactgroupid)
                            && contactGroupRecord.Id == pa.GetAttributeValue<EntityReference>(kys_portalaccess.kys_contactgroupid).Id;
                    });
```

## Query Experssion Example with LinkEntity for One-to-Many Relationships
```csharp
            // search for the portal access record
            QueryExpression portalAccessQuery = new QueryExpression(kys_portalaccess.EntityName);
            portalAccessQuery.Criteria.AddCondition(kys_portalaccess.kys_contactid, ConditionOperator.Equal, contactRef.Id);
            portalAccessQuery.Criteria.AddCondition(kys_portalaccess.kys_logintypecode, ConditionOperator.Equal, (int)kys_portalaccess.kys_logintypecode_OptionSet.GroupEmailLogin);
            portalAccessQuery.Criteria.AddCondition(kys_portalaccess.kys_contactgroupid, ConditionOperator.Equal, contactGroupRef.Id);
            portalAccessQuery.ColumnSet.AddColumns(kys_portalaccess.kys_lastlogindatetime, kys_portalaccess.kys_logincount, kys_portalaccess.statecode, kys_portalaccess.statuscode);
            portalAccessQuery.AddOrder(kys_portalaccess.kys_lastlogindatetime, OrderType.Descending);

            // Add link-entity query_kys_contactgroup
            var link = portalAccessQuery.AddLink(ContactGroup.EntityName, kys_portalaccess.kys_contactgroupid, ContactGroup.PrimaryKey);

            // Add columns to query_kys_contactgroup.Columns
            link.Columns.AddColumns(ContactGroup.kys_groupemailaddress);
            link.EntityAlias = "cg";

            EntityCollection portalAccessCollection = _orgService.RetrieveMultiple(portalAccessQuery);

            foreach (var pa in portalAccessCollection.Entities)
            {
                var groupEmail = pa.GetAttributeValue<AliasedValue>("cg.kys_groupemailaddress")?.Value as string;
            }
```

By the way, to extract value from AliasedValue, you can use the following code:
```csharp

```

## Query Experssion Example with LinkEntity for Many-to-Many Relationships
```csharp
            QueryExpression contactGroupsQuery = new QueryExpression(ContactGroup.EntityName);
            contactGroupsQuery.ColumnSet = new ColumnSet(ContactGroup.PrimaryKey, ContactGroup.PrimaryName, ContactGroup.kys_groupemailaddress);
            contactGroupsQuery.Criteria = new FilterExpression
            {
                Conditions =
                {
                    new ConditionExpression
                    {
                        AttributeName = ContactGroup.statecode,
                        Operator = ConditionOperator.Equal,
                        Values = { (int)ContactGroup.statecode_OptionSet.Active }
                    }
                }
            };

            LinkEntity link = new LinkEntity(ContactGroup.EntityName, ContactGroup.RelMM_kys_kys_contactgroup_contact, ContactGroup.PrimaryKey, ContactGroup.PrimaryKey, JoinOperator.Inner);
            link.LinkCriteria.AddCondition(new ConditionExpression(contact.PrimaryKey, ConditionOperator.Equal, contactId));
            contactGroupsQuery.LinkEntities.Add(link);

            EntityCollection relatedContactGroups = _orgService.RetrieveMultiple(contactGroupsQuery);
```

## LINQ Limitations: Multi-Field Joins
Remember, neither Query Expressions nor FetchXML natively support joins based on multiple fields in a single condition. Workarounds involve post-query processing with LINQ to Objects or loops.

## Null Exceptions: Staying Vigilant
Working with late bound entity objects, can often leads to null exception with errors like, "Object reference not set to an instance of an object".

So, please use null-conditional operator liberally. It can short circuit the expression and return null if the object is null, no matter when you try to access its children properties or call its children methods.

```csharp
entityrecord?.GetAttributeValue<EntityReference>(a_lookup_field_name)?.Id
```

**Refactoring Tip**: Always leverage replace tools when renaming fields or methods to avoid tedious manual updates.

## References
- https://learn.microsoft.com/en-us/power-apps/developer/data-platform/org-service/early-bound-programming
- https://learn.microsoft.com/en-us/power-apps/developer/data-platform/org-service/use-late-bound-entity-class-linq-query