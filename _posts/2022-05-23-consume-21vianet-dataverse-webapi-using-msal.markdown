---
layout: post
comments: true
title:  "Consume 21Vianet Dataverse Web API Using MSAL"
date:   2022-05-22 08:00:00 +0800
categories: Technology
tags: [Microsoft, Dynamics, Integration, Azure, Azure China, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Consume 21Vianet Dataverse Web API Using MSAL"
    facebook: "Consume 21Vianet Dataverse Web API Using MSAL"
    linkedin: "Consume 21Vianet Dataverse Web API Using MSAL"
---

## Overall
The layers between a consumer client application and Dataverse Web API are:
* A client application.
* An Azure AD App Registration.
* A Dataverse Application user.
* The Dataverse Web API.

## Client App
Please refer to [this article](./2022-01-10-xrmtoolbox-connection-for-azure-china-hosted-dataverse.html) for an app registration step-by-step guide.

### Key Parameters
``` csharp
string dataverseInstanceUrl = "https://your-org-name.crm.dynamics.cn/"; //Specify the Dataverse instance to connect with.
var clientId = "84a7e91f-cf9a-46ce-9069-xxxx429dxxxx"; // Azure Application (client) ID
var clientSecret = "X_l7f2dvqy-h.FAkeaQ8r93W-RUt2xxXXX";
var authority = "https://login.partner.microsoftonline.cn/your-tenent-id/oauth2/v2.0/authorize";

```

## Azure AD App Registration
OAuth authentication requires an AAD App registration, and it will contain setting values for the consumer application key parameters. I will highlight the location to get those values in the screenshots below. 

### ClientId
![image](../images/2022-05-23-consume-21vianet-dataverse-webapi-using-msal/aad-client-id.png)

### ClientSecret 
One registered Azure Application can have many client secrets. You need to copy the secret value right after its creation because it will disappear afterwards.
![image](../images/2022-05-23-consume-21vianet-dataverse-webapi-using-msal/aad-app-reg-secret.png)

### Authority Endpoints
![image](../images/2022-05-23-consume-21vianet-dataverse-webapi-using-msal/aad-oauth-authorization-endpoints.png)

## How to setup a Dataverse Application User?
* Log on to the Microsoft Power Platform Admin (D365 Admin) center as a system administrator.
* In the navigation pane, go to Environments and then select an environment from the list.
* On the Settings tab, go to Users "+ permissions", and then select Application users. Then
Click "+ New app user".
* Click on the "Add an app" button and search for an previously registered Azure App
* Select a Business unit for the user
* Select Security roles for the user

## How to Connect to Dataverse programmatically?
### PublicClientApplicationBuilder Class
For interactive client apps, please use the PublicClientApplicationBuilder class to get security tokens

``` csharp
var authBuilder = PublicClientApplicationBuilder.Create(clientId)
                    .WithAuthority(AadAuthorityAudience.AzureAdMultipleOrgs)
                    .WithRedirectUri(redirectUri)
                    .Build();
var scope = resource + "/.default";
string[] scopes = { scope };

AuthenticationResult token =
    authBuilder.AcquireTokenInteractive(scopes).ExecuteAsync().Result;
```

### ConfidentialClientApplicationBuilder Class
For backend applications, where an OAuth prompt for user name and password is not an option, you should use the ConfidentialClientApplicationBuilder class.

### Sample Code
``` csharp
        static void Main()
        {
            // Specify the Dataverse environment name to connect with.
            //string GlobalTenentResource = "https://<env-name>.<region>.dynamics.com";
            //string ChinaTenentResource = "https://<env-name>.<region>.dynamics.cn";
            string dataverseEnvironmentUrl = "https://your-env-name.crm.dynamics.cn/";

            // For your custom apps, you will need to register them with Azure AD yourself.
            var clientId = "84a7e91f-cf9a-46ce-9069-78cfxxxxxxxx"; // Application (client) ID
            var clientSecret = "X_l7f2dvqy-h.XXxx0Q8r93W-RUt2xxXXX";
            var authority = "https://login.partner.microsoftonline.cn/your-tenent-id/oauth2/v2.0/authorize";

            #region Authentication
            var clientApp = ConfidentialClientApplicationBuilder.Create(clientId)
                .WithClientSecret(clientSecret)
                .WithAuthority(new Uri(authority))
                .Build();
            var scope = dataverseEnvironmentUrl + "/.default";
            string[] scopes = { scope };

            AuthenticationResult token 
                = clientApp.AcquireTokenForClient(scopes).ExecuteAsync().GetAwaiter().GetResult();

            #endregion Authentication

            #region Client configuration

            var client = new HttpClient
            {
                BaseAddress = new Uri(dataverseEnvironmentUrl + "/api/data/v9.2/"),
                Timeout = new TimeSpan(0, 2, 0)    // Standard two minute timeout on web service calls.
            };

            // Default headers for each Web API call.
            HttpRequestHeaders headers = client.DefaultRequestHeaders;
            headers.Authorization = new AuthenticationHeaderValue("Bearer", token.AccessToken);
            headers.Add("OData-MaxVersion", "4.0");
            headers.Add("OData-Version", "4.0");
            headers.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            #endregion Client configuration

            #region Web API call

            // Invoke the Web API 'WhoAmI' unbound function.
            var response = client.GetAsync("WhoAmI").Result;

            if (response.IsSuccessStatusCode)
            {
                // Parse the JSON formatted service response (WhoAmIResponse) to obtain the user ID value.
                Guid userId = new Guid();

                String jsonContent = response.Content.ReadAsStringAsync().Result;

                using (JsonDocument doc = JsonDocument.Parse(jsonContent))
                {
                    JsonElement root = doc.RootElement;
                    JsonElement userIdElement = root.GetProperty("UserId");
                    userId = userIdElement.GetGuid();
                }

                Console.WriteLine("Your user ID is {0}", userId.ToString());
            }
            else
            {
                Console.WriteLine("Web API call failed");
                Console.WriteLine("Reason: " + response.ReasonPhrase);
            }
            #endregion Web API call

            // Pause program execution by waiting for a key press.
            Console.ReadKey();
        }
    }
```

## References
* https://nishantrana.me/2020/12/17/consume-dynamics-365-web-api-using-msal-net/ 
* https://docs.microsoft.com/en-gb/azure/active-directory/develop/msal-net-initializing-client-applications
* https://www.nuget.org/packages/Microsoft.Identity.Client/