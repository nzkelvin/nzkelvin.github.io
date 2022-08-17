---
layout: post
comments: true
title:  "Azure Logging TelemetryClient vs ILogger"
date:   2022-08-17 08:00:00 +0800
categories: Technology
tags: [Microsoft, Azure, Logging, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Azure Logging TelemetryClient vs ILogger"
    facebook: "Azure Logging TelemetryClient vs ILogger"
    linkedin: "Azure Logging TelemetryClient vs ILogger"
---

## Summary
TelemetryClient is more feature rich comparing to ILogger. However, it depends on Microsoft Azure Application Insights. So, your logging code will not work on other competing cloud platforms. 

So rule of thumb is to use ILogger by default. However, if you believe the subject application will stay with Azure and Application Insights forever, Application Insights can be a good option.

## Start with End in Sight
How are you going to the information you want from large loads of logging data?

Search will be the answer and **custom dimensions** will make your query a lot more percise. Useful dimensions are: Exception Type, Exception, Inner Exception, Method, Class Type, Source File Path.

## Technical: Libraries 
Logs with Microsoft.Extensions.Logging.ILogger
Logs using Microsoft.ApplicationInsights.TelemetryClient

## Technical: Extension Methods for ILogger
``` csharp
public static class LoggerExtensions
    {
        public static void LogInfo(this ILogger logger, string reason, int calloutId, int? companyId = null, int? customerId = null,
            [CallerMemberName] string method = "",
            [CallerFilePath] string srcFilePath = "",
            [CallerLineNumber] int srcLineNumber = 0)
        {
            logger.LogInformation("{reason}, {calloutId}, {companyId}, {customerId}, {method}, {srcFilePath}, {srcLineNumber}",
                reason, calloutId, companyId, customerId, method, srcFilePath, srcLineNumber);
        }

        public static void LogWarn(this ILogger logger, string reason, int calloutId, int? companyId = null, int? customerId = null,
            [CallerMemberName] string method = "",
            [CallerFilePath] string srcFilePath = "",
            [CallerLineNumber] int srcLineNumber = 0)
        {
            logger.LogWarning("{reason}, {calloutId}, {companyId}, {customerId}, {method}, {srcFilePath}, {srcLineNumber}",
                reason, calloutId, companyId, customerId, method, srcFilePath, srcLineNumber);
        }

        public static void LogErr(this ILogger logger, Exception ex, string reason, int calloutId, int? companyId = null, int? customerId = null,
            [CallerMemberName] string method = "",
            [CallerFilePath] string srcFilePath = "",
            [CallerLineNumber] int srcLineNumber = 0)
        {
            logger.LogError("{exType}, {reason}, {calloutId}, {companyId}, {customerId}, {method}, {srcFilePath}, {srcLineNumber}, {exDetails}",
                ex.GetType().Name, reason, calloutId, companyId, customerId, method, srcFilePath, srcLineNumber, ex.ToString());
        }
    }
```

*Source: https://hackernoon.com/fixing-logging-issues-in-aspnet-telemetryclient-vs-ilogger-sev339a*

## Technical: Gochya(s)
ILogger using ToString() method so complex type will be logged as its fully qualified name ONLY. The workaround is to ToJson() method for serialization before feeding it to ILogger.

## References
(Fixing Logging Issues In ASP.NET: TelemetryClient Vs. ILogger)[https://hackernoon.com/fixing-logging-issues-in-aspnet-telemetryclient-vs-ilogger-sev339a]