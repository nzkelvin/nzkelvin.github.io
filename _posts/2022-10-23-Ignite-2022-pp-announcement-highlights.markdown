---
layout: post
comments: true
title:  "aaa templates"
date:   2019-01-01 08:00:00 +0800
categories: Technology
tags: [Microsoft, Dynamics, Integration, Azure, Azure China, Twitter, Facebook, LinkedIn]
sharing:
    twitter: ""
    facebook: ""
    linkedin: ""
---

## Power Pages GA
Power Pages as a standalone Power Platform product is now GA. It is a new member to a family of Power Platform products, including Power Apps, Power Automate, Power BI, Power Virtual Agent. Previously, it is call Power Apps Portal.

Another important change is the Power Pages license model. It is no longer charged by the number of view. Instead, it is charged per website via monthly authenticated and anonymous users. So, I guess it will be a good choice for many 2B scenarios. For 2C scenarios, you need to consider the potential number of users and consequently the licensing cost.

>In May 2022, Microsoft Power Platform announced Power Pages as a standalone product in preview. Today, we're proud to announce that Power Pages is generally available. 
>
>As demand for custom, well-crafted business websites surges, it is increasingly difficult for IT departments and developers to write custom code for every webpage.
>
>Power Pages enables citizen developers and professional developers alike to rapidly spin up low-code, scalable, and secure business-centric websites. 
>
>For customers to focus more on website development and less on licensing, Power Pages has also simplified its business model by moving to capacity-based subscriptions and pay-as-you-go meters. 
>
>Power Pages licenses are now charged per website via monthly authenticated and anonymous users. Additionally, Power Pages has also removed the distinction between internal and external authenticated users. 
>
>These changes make it easier for organizations to choose appropriate licensing options for their website.



## Header 1
**bold**
*Italic*

## Link
[RemoteExecutionContext](https://docs.microsoft.com/en-us/dotnet/api/microsoft.xrm.sdk.remoteexecutioncontext?view=dataverse-sdk-latest&viewFallbackFrom=dynamics-general-ce-9)

## Images 
![image](../images/2020-04-15-azure-storage-emulator-initiation-error/StorageEmulatorInitError.png)

## Blockquote
> "Lorem Ipsum"

## Code
``` csharp
static Guid GetUserId(string resource, string accessToken)
{
    using (var client = new HttpClient())
    {
        // Use the WhoAmI function
        var response = client.GetAsync("WhoAmI").Result;

        if (response.IsSuccessStatusCode)
        {
            //Get the response content and parse it.  
            JObject body = JObject
                .Parse(response.Content.ReadAsStringAsync().Result);
            Guid userId = (Guid)body["UserId"];
            return userId;
        }
        else
        {
            throw new Exception(string.Format(
                "The WhoAmI request failed with a status of '{0}'",
                response.ReasonPhrase));

        }
    }
}
```


## Table
There must be an empty line before a table

| ADFS 2.0 name | PingFederate name | Concept |
| ---------------- | ---------------- | -------------- |
| Security Token | Assertion | A collection of XML-formatted security information, describing a user, that is created and consumed during a federated access request |
| Claims Provider | Identity Provider (IdP) | The partner in a federation that creates security tokens for users |
| Relying Party | Service Provider (SP) | The partner in a federation that consumes security tokens for providing access to applications |
| Claims | Assertion attributes | Data about users that is sent inside security tokens |

There must be an empty line after a table
