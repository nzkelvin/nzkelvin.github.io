---
layout: post
comments: true
title:  "TypeScript for Dynamics 365 CE"
date:   2024-09-27 08:00:00 +0800
categories: Technology
tags: [TypeScript, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "TypeScript for Dynamics 365 CE"
    facebook: "TypeScript for Dynamics 365 CE"
    linkedin: "TypeScript for Dynamics 365 CE"
---

## TypeScript Benefit


## Get Context Variables
```TypeScript
        let userSettings = <Xrm.userSettings>(<any>executionContext.getFormContext()).context.userSettings;

        let currentUserId = userSettings.userId.replace(/[{}]/g, '').toLowerCase();
```

```TypeScript
        let mainFormContext = <Form.kys_case.Main.CaseMainForm>executionContext.getFormContext();

        let caseId = mainFormContext.data.entity.getId().replace(/[{}]/g, '').toLowerCase();
```


## Query > XrmQuery
Limitation is filter on expand tables don't work while as it is possible with a WebAPI call.

```javascript
        let conflicts = await XrmQuery.retrieveMultiple(x => x.kys_caseconflictofinterests)
            .select(x => [x.kys_caseid_guid, x.kys_userid_guid])
            .filter(x => Filter.equals(x.kys_userid_guid, Filter.makeGuid(currentUserId)))
            .andFilter(x => Filter.equals(x.kys_caseid_guid, Filter.makeGuid(caseId)))
            .andFilter(x => Filter.equals(x.statecode, kys_caseconflictofinterest_statecode.Active))
            .promise();
```

## Query > XrmQuery with FetchXML
```javascript
        let conflicts = await XrmQuery.retrieveMultiple(x => x.courts_caseconflictofinterests)
            .useFetchXml("<fetch> \
                    <entity name='kys_caseconflictofinterest'> \
                        <filter >\
                            <condition attribute='kys_caseid' operator = 'eq' value = 'zzzz0bf5-6e8b-ef11-9999-0000000b0e2a' /> \
                            <condition attribute='statecode' operator = 'eq' value = '0' /> \
                        </filter> \
                    </entity> \
                </fetch>")
            .promise();
```

## Query > Xrm.WebApi
If XrmQuery doesn't work you can alway rollback to Xrm.WebApi, but you will lose on intellisense provided by TypeScript

## TypeScript Typing Definition
dg.xrmquery.web.d.ts

## Compile
### Webpack
mininization 

### Debug > inline mapping



## References
* https://github.com/delegateas/XrmDefinitelyTyped/wiki/XrmQuery.REST
