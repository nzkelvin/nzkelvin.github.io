---
layout: post
comments: true
title:  "Setup XrmToolBox Connection for Azure China Hosted Dataverse"
date:   2022-01-10 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Dataverse, XrmToolBox, Authentication, OAuth]
sharing:
    twitter: "Setup XrmToolBox Connection for Azure China Hosted Dataverse"
    facebook: "Setup XrmToolBox Connection for Azure China Hosted Dataverse"
    linkedin: "Setup XrmToolBox Connection for Azure China Hosted Dataverse"
---

## Connect XrmToolBox to a 21Vianet hosted Dataverse instance
The XrmToolBox Connection Wizard didn't work when I connected to a Dataverse instance hosted on 21Vianet.
![image](../images\2022-01-10-xrmtoolbox-connection-for-azure-china-hosted-dataverse\connetion-wizard-error.png)

### What is 21Vianet?
There is a special version of Azure cloud for the China market, and it is hosted by a company called 21Vianet.

## OAuth Authentication service
Microsoft 365 uses AAD, a cloud-based user identity and authentication service, to manage identities and authentication for Microsoft 365.

Since we failed to establish trust between the D365 instance and XrmToolBox (the client) using the default AAD authentication method.

So, the solution is to use an AAD OAuth authentication service.

## XrmToolBox
CrmToolBox has six types of connection methods. I often use connection wizard before. However, it doesn't support OAuth authentication.

Fortunately, four out of the six connection methods support OAuth. There are Microsoft Login Control, Connection String, OAuth / MFA, and Client Id / Secret
![image](../images\2022-01-10-xrmtoolbox-connection-for-azure-china-hosted-dataverse\xrmtoolbox-six-types-of-connection-methods.png)

## App Registration 
To enable the AAD OAuth authentication method, you must create an Azure App Registration. 
![image](../images\2022-01-10-xrmtoolbox-connection-for-azure-china-hosted-dataverse\new-app-registration.png)

You will use the "Application (client) ID" value later in your XrmToolBox.
![image](../images\2022-01-10-xrmtoolbox-connection-for-azure-china-hosted-dataverse\app-registration-overview.png)

![image](../images\2022-01-10-xrmtoolbox-connection-for-azure-china-hosted-dataverse\app-registration-allow-public-flow-and-redirect-uri.png)

You must remember to grand consent when adding API permissions.
![image](../images\2022-01-10-xrmtoolbox-connection-for-azure-china-hosted-dataverse\app-registration-add-api-permission.png)

![image](../images\2022-01-10-xrmtoolbox-connection-for-azure-china-hosted-dataverse\app-registration-add-client-secret.png)

## Connect via Microsoft Login Control
You should provide your own OAuth configuration.
![image](../images\2022-01-10-xrmtoolbox-connection-for-azure-china-hosted-dataverse\microsoft-login-control-connection.png)

## Connect via Connection String
The below connection string is an example.

authtype=OAuth;username=user1@orgname.partner.onmschina.cn;password=your-password;url=https://instancename.crm.dynamics.cn;appid=xxxxxxxx-cf9a-46ce-9069-xxxx429dxxxx;redirecturi=https://contoso.com;tokencachestorepath=C:\xrm-oauth-cache;loginprompt=Auto

## References
https://petri.com/understanding-azure-app-registrations

https://blog.csdn.net/vic0228/article/details/117256333

https://docs.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad