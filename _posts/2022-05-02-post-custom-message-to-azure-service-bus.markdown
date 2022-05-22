---
layout: post
comments: true
title:  "Post Custom Message to Azure Service Bus"
date:   2022-05-01 08:00:00 +0800
categories: Technology
tags: [Microsoft, Dynamics, Integration, Azure, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Post Custom Message to Azure Service Bus"
    facebook: "Post Custom Message to Azure Service Bus"
    linkedin: "Post Custom Message to Azure Service Bus"
---

## Service Endpoints and Azure-aware Plugins
Service endpoints allow you to send Dynamics 365 plugin execution context to [Azure Service Bus, Topic](https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/write-custom-azure-aware-plugin?view=op-9-1), or [Event Hub](https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/work-event-data-azure-event-hub-solution?view=op-9-1). 

Suppose you are not happy with the OOTB behaviour of Service Endpoints. In that case, you can [register Azure-aware plugin steps](https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/walkthrough-register-azure-aware-plug-in-using-plug-in-registration-tool?view=op-9-1) to manipulate the current execution context before sending it down the wire.

## Limitation: Message Size Overhead and Rigid Schema
Service endpoints send out an serialised (RemoteExecutionContext)[https://docs.microsoft.com/en-us/dotnet/api/microsoft.xrm.sdk.remoteexecutioncontext?view=dataverse-sdk-latest&viewFallbackFrom=dynamics-general-ce-9] object (with manipulation or not). So, the messages have a lot of overhead the receiver may not need. For example, suppose you only want to send a message to inform about a record status change. In that case, the PluginExecutionContext object will come with information about the current user, context depth, all the changed fields, etc.

In a perfect world, I should be able to dictate the exact JSON message schema my plugin will produce. But unfortunately, I don't have a say on the output message schema. It is because service endpoints can only serialize PluginExecutionContext objects.

## Limitation: Session Enabled Service Bus or Topic
[A session enabled service bus or topic](https://docs.microsoft.com/en-us/azure/service-bus-messaging/message-sessions) will guarantee the FIFO (First In First Out) order of message processing which is important in many scenarios. Unfortunately, service endpoints don't seem to support this feature.

## Solution: Plugins
So, if I can send out messages programmatically from plugins, I will be able to bypass the above-mentioned limitations.

### Use HttpClient instead of ServiceBusClient
You can find plenty of code examples of sending messages to Azure Service Bus. Many of them are [ServiceBusClient Class](https://docs.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.servicebusclient?view=azure-dotnet) based. Unfortunately, D365 doesn't allow you to register plugin assemblies depending 3rd party libraries, and using ILmerge is hugely frowned upon. 

So, you will need complete the feat with just the HttpClient class. Ajit Patra has [an excellent article](https://ajitpatra.com/2019/12/09/d365-post-custom-message-to-azure-service-bus-queue-c/) about posting custom messages to Azure Service Bus Queue C#. The key is to get an SAS token for your HTTP POST request. 

I also enjoyed his [blog post](https://ajitpatra.com/2020/04/14/d365-post-custom-message-to-session-enabled-service-bus-queue-c/) about sending messages to session enabled Azure Service Bus Queues and Topics.

### My Improvements
For my production codebase, I made a couple of improvements to Ajit's example code.
* I added some handler code for unsuccessful [HTTP responses](https://www.restapitutorial.com/httpstatuscodes.html). A quick tip: Azure Service Bus returns HTTP status code 201 on a successful POST.
* I added retry capabilities to the Post method.

I hope you will find the code snippet below helpful.

``` csharp
public HttpResponseMessage Post(string requestUri, string content, string sessionId, ITracingService tracer)
{
    const string MEDIA_TYPE = "application/json";
    const int RETRY_WAIT_MIllISECONDS = 3000;
    StringContent request;
    HttpResponseMessage response = null;

    int attempt = 0;
    while (attempt < _maxRetryCount)
    {
        try
        {
            _httpClient.DefaultRequestHeaders.Clear();
            if (!String.IsNullOrEmpty(sessionId))
            {
                var brokerProperties = new BrokerProperties { SessionId = sessionId };
                _httpClient.DefaultRequestHeaders.Add("BrokerProperties", brokerProperties.SerializeToJson());
            }
            _httpClient.DefaultRequestHeaders.Add("Authorization", _authorization);
            _httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue(MEDIA_TYPE));

            request = new StringContent(content, Encoding.UTF8, MEDIA_TYPE);

            response = _httpClient.PostAsync(requestUri, request)?.Result;

            if (response.IsSuccessStatusCode)
            {
                tracer.Trace($"{nameof(ServiceBusTopicClient)}.{nameof(Post)} was successful. HTTP Status Code = {(int)response.StatusCode}. Request = {content}");
                return response;
            }
            else
            {
                tracer.Trace($"{nameof(ServiceBusTopicClient)}.{nameof(Post)} returned error. HTTP Status Code = {(int)response.StatusCode}. Request = {content}");
            }
        }
        catch (Exception exp)
        {
            tracer.Trace($"Unable to Send Request. {nameof(ServiceBusTopicClient)}.{nameof(Post)}. {nameof(sessionId)}={sessionId}, {nameof(content)}={content}. \r\nInner Exception={exp.Message} \r\nStackTrack={exp.StackTrace}");
        }
        finally
        {
            attempt++;
            Thread.Sleep(RETRY_WAIT_MIllISECONDS);
        }
    }

    return null;
}
```

## References
* [Write a custom Azure-aware plug-in](https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/write-custom-azure-aware-plugin?view=op-9-1)