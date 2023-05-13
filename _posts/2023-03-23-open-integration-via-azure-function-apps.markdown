---
layout: post
comments: true
title:  "OpenAI Integration via Azure Function Apps"
date:   2023-03-23 08:00:00 +0800
categories: Technology
tags: [Microsoft, Azure, Integration, OpenAI, AIGC, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "OpenAI Integration via Azure Function Apps"
    facebook: "OpenAI Integration via Azure Function Apps"
    linkedin: "OpenAI Integration via Azure Function Apps"
---
## Overcoming Challenges with OpenAI Integration
Whether you are building a Single Page Application (SPA) and seeking to leverage the powerful features of OpenAI's GPT models, or you live in a region where OpenAI services are blocked, there's a solution for you: building a backend/proxy/integration layer. This solution can also be useful if you aim to include OpenAI as part of your product offering or wish to access functionalities not currently available with ChatGPT, such as image generation.

## Why a Backend/Proxy/Integration Layer?
Integrating OpenAI directly into your web frontend application might expose your OpenAI API keys, posing a significant security risk. Furthermore, direct access to OpenAI services may not be possible if you're in a region where these services are restricted. By establishing a backend or proxy, you can securely integrate OpenAI's features into your application while also providing a workaround to bypass regional restrictions.

## Understanding OpenAI's Structure
OpenAI provides an extensive documentation that can help you grasp its key concepts, primarily Models and Endpoints. Simply put, Endpoints are functionalities that can be executed using different models. The results you receive may vary depending on the model you choose to execute a particular functionality.

## Tooling and Pricing
OpenAI's documentation includes valuable information about tooling and pricing. Knowing the cost of different services and understanding the available libraries can help you make an informed decision about which functionalities to incorporate into your application.

## Delving Deeper with API Reference Documentation
For more detailed, technical information down to the parameter level, OpenAI's API reference documentation is the go-to resource. This comprehensive guide provides in-depth insight into the inner workings of OpenAI's APIs, empowering you to optimize your backend integration effectively.

## Building with Node.js
OpenAI's documentation provides code samples primarily in Python and Node.js. Given the popularity and efficiency of Node.js in building serverless functions, we'll focus on creating our Azure Function App using this language.

### Pre-requisites
You will need the following tools for building your Azure Function:
* Azure Function Core Tools - You need this tools for triggering, running, and debugging an Azure Function locally. If you installed the wrong version (different from what is in the cloud), your Azure Function App may not work after being uploaded to the cloud.

* Azure Functions VS Code Extension: This tool can help you to create Azure Functions with its templates and to deploy it to the cloud.

![image](../images\2023-03-23-openai-integration-via-azure-function-apps\azure-function-tools-vscode-extension.png) 

### Pre-requisites - install Azure Function Core Tools 
If you have a previous version(s) of Azure Function Core Tools installed, please uninstall, delete the 'appData\Local\AzurefunctionsTools\' folder, and re-install.

### Coding - V4 programming model
"AzureWebJobsFeatureFlags": "EnableWorkerIndexing" is an application setting that needs to be added to your V4 programming model app in Azure. This setting enables your app to run in Azure. You need to include it in your local.settings.json file as well as add it to Azure Function configuration in the cloud. You can run the following command to add this setting to your new function app in Azure.

```powershell
az functionapp config appsettings set --name <app_name> --resource-group <resource_group_name> --settings AzureWebJobsFeatureFlags=EnableWorkerIndexing
```

![image](../images\2023-03-23-openai-integration-via-azure-function-apps\v4-programming-model-webjob-feature-flags.png)

### Coding - Transpile
When the "type" property is not set in the package.json file, Node.js treats your project as a **CommonJS module** by default. Inside CommonJS, you cannot use certain ECMAScript module features, such as import and export,

### Code
```csharp
const { app } = require('@azure/functions');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.http('chatCompletions', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const { messages } = await request.json();

        context.log(messages);
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {"role": "system", "content": "You are DesignGPT helpful assistant"},
            ...messages
          ],
        });
    
        return { jsonBody: {
            completion: completion.data.choices[0].message
        }};
    }
});

```

## Results
![image](../images\2023-03-23-openai-integration-via-azure-function-apps\postman-request-azure-function-api-wrapper.png)

## Summary
In conclusion, building a backend/proxy/integration layer offers a practical solution for secure and efficient integration with OpenAI. By understanding the key concepts and making use of the extensive documentation provided by OpenAI, you can enhance your application or product offering, and overcome any regional restrictions that may be in place.
