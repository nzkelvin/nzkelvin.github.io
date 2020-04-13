---
layout: post
comments: true
title:  "Dynamics 365 OAuth 2.0 Authentication with Azure AD"
date:   2020-04-12 08:00:00 +0800
categories: Technology
tags: [Azure, Azure AD, OAuth, Azure Function, .Net Core, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Dynamics 365 OAuth 2.0 Authentication with Azure AD"
    facebook: "Dynamics 365 OAuth 2.9 Authentication with Azure AD"
    linkedin: "Dynamics 365 OAuth 2.0 Authentication with Azure AD"
---
In a nutshell, the goal is to get a security token from Azure AD via OAuth 2.0 protocal. 

There are many OAuth 2.0 and OpenID Connect flows, the flow I am focusing on is called ("OAuth 2.0 authorization code flow")[https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow#protocol-diagram]. A typical user case is to allow a web/native app to authenticate on its own, i.e. without popup an SSO dialog to a user, so it can communicate with target Web APIs in background jobs.
![image](https://docs.microsoft.com/en-us/azure/active-directory/develop/media/v2-oauth2-auth-code-flow/convergence-scenarios-native.svg)

# A Step-by-step Guide
## Azure Application Registration
* Go to portal.azure.com and log in as an global admin of the same tenant to which the target D365 instance belongs to.
* Create an App Registration and configure its Authentication setting to "Single Organization". (Question to myself: why not set to "multipe org"?)
* In the app registration, add the "Dynamics CRM" API permission for Dynamics CRM. Alternatively, you can select the "PowerApps Runtime Service" permission.
![image](../images/2020-04-12-d365-oauth2-authentication-with-azure-ad/AddApiPermissionForD365.png)
![image](../images/2020-04-12-d365-oauth2-authentication-with-azure-ad/AddDelegatedPermissionForD365.png)
* Grant consent to the Dynamics CRM permission we just setup. Confirming by checking "Yes".
![image](../images/2020-04-12-d365-oauth2-authentication-with-azure-ad/GrantConsentForApiPermission.png)
* Create an (application) client secret for the App Registration and set it to "never expire".
![image](../images/2020-04-12-d365-oauth2-authentication-with-azure-ad/CreateClientSecret.png)
* **You MUST copy the client secret straight after the creation because after that it will disappear forever!**
![image](../images/2020-04-12-d365-oauth2-authentication-with-azure-ad/ClientSecret.png)

## Service/Daemon User Setup
* Create an Azure AD User. You do so either in portal.azure.com or the Office 365 admin portal.
![image](../images/2020-04-12-d365-oauth2-authentication-with-azure-ad/CreateAnAadUserStep1.png)
![image](../images/2020-04-12-d365-oauth2-authentication-with-azure-ad/CreateAnAadUser.png)
* Bind the AAD user with the registered Azure Application before by creating a Dynamics 365 [Application User](https://docs.microsoft.com/en-us/power-platform/admin/create-users-assign-online-security-roles#create-an-application-user). Go to Users > Application User view > New > **Application User form**. The good news is that application users are not counted towards the seven non-interactive user account limit. So you don't have to give it a license temporarily and remove it later like in the bad old days :-). 
![image](../images/2020-04-12-d365-oauth2-authentication-with-azure-ad/CreateD365ApplicationUserStep1.png)
* The value of the "Application ID" field needs to match to the registered Azure Application we setup before.
![image](../images/2020-04-12-d365-oauth2-authentication-with-azure-ad/CreateD365ApplicationUserStep2.png)
* Of course, you will need to give the user a D365 security role. The recommended approach is to create an existing role the modify it.

### Error Message When Your User Setup is Incorrect
![image](../images/2020-04-12-d365-oauth2-authentication-with-azure-ad/ErrorMsgFromIncorrectUserSetup.png)

# Client side Code
## Coding with ADAL
### Nuget
In order to support .Net Core, you must use ADAL version 3.x or later.

* Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -Version 3.19.8
* Install-Package Newtonsoft.Json -Version 12.0.3
* Install-Package Xrm.Tools.CRMWebAPI -Version 1.0.25

### Code Example
My code example is based on [PowerApps-Samples](https://github.com/Microsoft/PowerApps-Samples/tree/master/cds/webapi/C%23/ADALV3WhoAmI/ADALV3WhoAmI). I change the MS code example to allow sign-in in silence mode.

The [UserCredential](https://stackoverflow.com/questions/37465949/adal-net-v3-does-not-support-acquiretoken-with-usercredential) class in ADAL version 2.x will no longer takes password as a parameter by design. In version 3.x, ClientCredential is my new friend.

``` csharp
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Kys.D365.WebApi.ConsoleClient
{
    class Program
    {
        static void Main(string[] args)
        {
            // The URL to the CDS environment you want to connect with
            string resource = "https://--makeyourown--.crm5.dynamics.com";
            string tenantId = "25487e65---makeyourown---e02767d478ee"; // Azure Admin Portal > Home > Azure Active Directory > Tenant ID

            // Azure Active Directory registered app clientid for Microsoft samples
            var clientId = "8e744428---makeyourown---576d0ea0816f"; // Azure Admin Portal > Home > App registration > Open an app > Application (client) ID
            var clientSecret = "m.-m[?FF--makeyourown--5EkXc35"; // Azure Admin Portal > Home > App registration > Open an app > Certificates & secrets > Only visible during creation

            // Azure Active Directory registered app Redirect URI for Microsoft samples
            var redirectUri = new Uri("http://localhost");
            string authority = "https://login.microsoftonline.com/" + tenantId;

            var context = new AuthenticationContext(authority, false);

            //Display prompt allowing user to select account to use.
            //var platformParameters = new PlatformParameters();

            ClientCredential clientCredential = new ClientCredential(clientId, clientSecret);

            //Get the token based on the credentials entered
            var token = context.AcquireTokenAsync(resource, clientCredential).Result;

            //Get the token
            try
            {
                Guid UserId = GetUserId(resource, token.AccessToken);
                Console.WriteLine("Your UserId is : {0}", UserId);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: {0}", ex.Message);
                return;
            }
            Console.WriteLine("Press any key to exit");
            Console.ReadLine();
        }

        static Guid GetUserId(string resource, string accessToken)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(resource + "/api/data/v9.1/");
                client.DefaultRequestHeaders.Authorization =
                  new AuthenticationHeaderValue("Bearer", accessToken);
                client.Timeout = new TimeSpan(0, 2, 0);
                client.DefaultRequestHeaders.Add("OData-MaxVersion", "4.0");
                client.DefaultRequestHeaders.Add("OData-Version", "4.0");
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));

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
    }
}
```

## Coding with MSAL.NET
ADAL was superceded by MSAL.NET. I will circle back after I get a chance to try [some MSAL code samples](https://docs.microsoft.com/en-us/azure/active-directory/develop/sample-v2-code). 

## Coding with RESTSharp
https://stackoverflow.com/questions/30133937/how-to-use-oauth2-in-restsharp

## Coding without Using Any Library
https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/authenticate-oauth#use-the-accesstoken-with-your-requests

# CDS Client Library
The "XrmServices/2011" SOAP service endpoints (Organization Service) are on its way out. People have been asking for the replacement for XrmTooling.CoreAssembly (Microsoft.CrmSdk.XrmTooling.CoreAssembly Nuguet package) for many years.

So the [CDS Client (Microsoft.Powerplatform.Cds.Client)](https://www.nuget.org/packages/Microsoft.Powerplatform.Cds.Client/) supposed to be the answer. [It was announced](https://powerusers.microsoft.com/t5/Power-Apps-Pro-Dev-ISV/Announcing-the-net-Core-SDK-for-Common-Data-Service-CDS-External/td-p/470035) in Feb 2020 and has been in alpla until now (April 2020).

* It doesn't support .Net Standard yet
* CDS is not D365 after all so you shouldn't expect functionalities not supported by CDS.

## Azure China
I will compare Azure China to Azure Global on the OAuth topic in another post.
https://docs.microsoft.com/en-us/azure/china/resources-developer-guide#check-endpoints-in-azure

# Future Related Blog Posts
* Impersonation after OAuth Authorization
* Multi-tenant Authorization

## Reference
* [A great blog post](https://www.cnblogs.com/luoyong0201/p/Dynamics_365_OAuth2_Client_Credentials_Server_to_Server_Authentication_web_api.html) from Luo Yong (Microsoft). The post is written in Chinese with a lot of screenshots and 2 code samples.
* [An old post from John Towgood](https://www.magnetismsolutions.com/blog/johntowgood/2018/03/08/dynamics-365-online-authenticate-with-client-credentials)
* [Quickstart: Configure a client application to access web APIs](https://docs.microsoft.com/en-nz/azure/active-directory/develop/quickstart-configure-app-access-web-apis)
* [Register an app with Azure Active Directory](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/walkthrough-register-app-azure-active-directory)
* [Obtain OrganizationService using Application User in Dynamics 365](https://www.inogic.com/blog/2018/10/obtain-organizationservice-using-application-user-in-dynamics-365/)