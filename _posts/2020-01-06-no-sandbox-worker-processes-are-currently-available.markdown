---
layout: post
comments: true
title:  "No Sandbox Worker processes are currently available"
date:   2020-01-06 08:00:00 +0800
categories: Technology
tags: [Dynamics, Plugin, Sandbox, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "No Sandbox Worker processes are currently available"
    facebook: "No Sandbox Worker processes are currently available"
    linkedin: "No Sandbox Worker processes are currently available"
---
Our tester reported the following error logged in a Dynamics 365 online instance multiple times and it is a blocker. The Dynamics 365 instance consists of a Sales module and a PSA module.

`Error: The plug-in execution failed because no Sandbox Worker processes are currently available.`

# Dynamics Sandbox Understanding (The Mechanism)
VarunReddyParam has an excellent [write up](https://varunreddyparam.wordpress.com/about/) on the topic. Therefore I am not going to repeat it here. In summary, partially trusted work load in Dynamics 365 follows two flows below.

w3wp > sandbox host > sandbox worker
![image](https://varunreddyparam.files.wordpress.com/2016/11/plugin-execution-by-w3wp.jpg)

CrmAsyncService > sandbox host > sandbox worker
![image](https://varunreddyparam.files.wordpress.com/2016/11/workflow-execution-by-crm-async-process.jpg)

# Possible Causes
* Microsoft platform issues. The host of my Dynamics 365 ran out of worker processes. 
* w3wp put too much load on the sandbox host.
* CrmAsyncService puts too much load on the sandbox host.
* Check SPN (Server Principle Name) if you are on Dynamics 365 on-premise. My friend Aung Khaing kindly supplied this comment.

# The REAL Cause
This is GOLD from another friend - Mr. M.S.! He directly IMed me.  

The real culprit is an "Async void" method. Below is a sequence of events leading up to the error.

Async void > excption > plugin context doesn't exist anymore > error bubbles up to sandbox processing service > 3 errors will cause the service to restart > no more sandbox worker process during the restarting.

## Solution: convert async code to sync code
Some sample code below

``` csharp
        private void archiveDocAsync(Entity targetEntity, IPluginExecutionContext context, IOrganizationService service)
        {
            try
            {
                var postAsyncTask = client.PostAsync("https://test.com/api/archive", content);
                postAsyncTask.Wait();

                var httpResponseMessage = postAsyncTask.Result;
                var r = httpResponseMessage.Content.ReadAsStringAsync();
                _tracer.Trace(r)
            }
            catch (AggregateException ae)
            {
                ae.Handle(inner =>
                {
                    _tracer.Trace(inner.Message);

                    return true;
                });

                throw;
            }
        }
```
## References
https://blog.elmah.io/debugging-system-aggregateexception-even-in-async-code/

http://hamidmosalla.com/2018/06/19/exception-handling-in-asynchronous-code/

# Narrow Down
I looked through all workflow system jobs. There were failed ones but none of them has the "no Sandbox Worker processes" error.



I didn't have enought information to pin point the issue. So, I will need some Microsft help because only they can see see lower level errors and logs. 

# Microsoft Customer Support Service
I was hoping Microsoft CSS can 
* Narrow down if it is a platform issue or a customization issue.
* If it is a customization issue, they could pin point which workflow or plugin was the culprit.

So a premium support ticket with an escalation to level A later, Microsoft recommended us to review our plugin code.

# The Key Takeaways
There are three takeaways. Performance, performance, and performance.

Review your plugin where:
* Plugins trigger on all entities.
* Plugins trigger on all attributes.
* Plugins code retrieves ALL fields.
* Plugins takes too long to execute. For example, plugins process/validate/generate/upload files. Maybe convert it into an asynchronous workflow?

Fixing issues retrospetively is expensive. You should do the right thing in the first place.

# References
* [Sandbox (Isolation) Mode in MS CRM](https://varunreddyparam.wordpress.com/2016/11/01/sandbox-isolation-mode-in-ms-crm/)