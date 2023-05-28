---
layout: post
comments: true
title:  "Understanding Azure AD B2C Custom Policies"
date:   2023-04-13 08:00:00 +0800
categories: Technology
tags: [Microsoft, Azure, Web, Power Pages, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Understanding Azure AD B2C Custom Policies"
    facebook: "Understanding Azure AD B2C Custom Policies"
    linkedin: "Understanding Azure AD B2C Custom Policies"
---

# Understanding Azure AD B2C Custom Policies: A Comprehensive Guide

When navigating the world of Azure Active Directory B2C (AAD B2C), the concept of custom policies can often seem daunting. In this blog post, we will dive into the details of these custom policies, break down their components, and highlight how they can be used to create a versatile and customized user journey.

## Custom Policy Components Hierarchy

An Azure AD B2C custom policy XML file is akin to a database of its components. It contains a hierarchy of building blocks that together form a roadmap for your user's journey. This hierarchical structure includes elements such as UserJourneys, ClaimsProviders, ClaimsTransformations, and more. Thinking of the XML file as a database or even a book, with each component as a chapter, can help you comprehend the structure and flow of custom policies.

- **TrustFrameworkPolicy**
  - **BuildingBlocks**
    - **ClaimsSchema**
      - **ClaimType**
    - **ContentDefinitions**
      - **ContentDefinition**
    - **ClaimsTransformations**
      - **ClaimsTransformation**
    - **Predicates**
      - **Predicate**
    - **PredicateGroups**
      - **PredicateGroup**
    - **ClaimsProviders**
      - **ClaimsProvider**
        - **DisplayName**
        - **TechnicalProfiles**
          - **TechnicalProfile**
    - **UserJourneys**
      - **UserJourney**
        - **OrchestrationSteps**
          - **OrchestrationStep**
            - **Preconditions**
              - **Precondition**
            - **ClaimsProviderSelections**
              - **ClaimsProviderSelection**
            - **ClaimsExchanges**
              - **ClaimsExchange**
  - **RelyingParty**
    - **DefaultUserJourney**
    - **TechnicalProfile**

## UserJourneys and Entry Points

A UserJourney has its own unique path or URL that a user can visit. Upon visiting this URL, the user embarks on a journey, with the first OrchestrationStep acting as the starting point or the entry to this journey. It's similar to entering a maze, with each turn representing an OrchestrationStep. You also can think it consists of a series of pages which are defined by the customer policy XML.

## ClaimsProviderSelection

Within this journey, Azure AD B2C utilizes a ClaimsProviderSelection to determine which ClaimsExchange can be activated based on the user's choices. 

For example, if you're creating a login screen with two buttons, one for signing in and another for password reset, ClaimsProviderSelection is the tool that helps guide the user to the correct ClaimsExchange based on the button they select.

![image](../images\2023-04-13-azure-ad-b2c-custom-policies\claims-provider-selection.png) 


```xml
                <OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
                    <ClaimsProviderSelections>
                        <ClaimsProviderSelection ValidationClaimsExchangeId="LocalAccountSigninEmailExchange" />
                        <ClaimsProviderSelection TargetClaimsExchangeId="ForgotPasswordExchange" />
                    </ClaimsProviderSelections>
                    <ClaimsExchanges>
                        <ClaimsExchange Id="LocalAccountSigninEmailExchange" TechnicalProfileReferenceId="SelfAsserted-LocalAccountSignin-Email" />
                    </ClaimsExchanges>
                </OrchestrationStep>
                <OrchestrationStep Order="2" Type="ClaimsExchange">
                    <Preconditions>
                        <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
                            <Value>objectId</Value>
                            <Action>SkipThisOrchestrationStep</Action>
                        </Precondition>
                    </Preconditions>
                    <ClaimsExchanges>
                        <ClaimsExchange Id="ForgotPasswordExchange" TechnicalProfileReferenceId="ForgotPassword" />
                    </ClaimsExchanges>
                </OrchestrationStep>
```

## Branching and Precondition

Although ClaimsProviderSelection can direct a user to a particular ClaimsExchange, the OrchestrationSteps still execute sequentially. This sequential execution can sometimes lead to a ClaimsExchange being activated twice, once by the OrchestrationStep, and again by the ClaimsProviderSelection.

In such a scenario, a Precondition can be used to prevent duplicate execution. By using preconditions in combination of ClaimsProviderSelection, you can achieve branching logics.

## Enhance Your Journey with Azure Functions or Web API Calls

Azure AD B2C's custom policies can be enriched with external functionalities like Azure Functions or web APIs through the RestfulProvider handler. This is like adding special features to your car to make your journey more comfortable and enjoyable. For instance, if you want to record an audit trail every time a user successfully signs in, you can use this handler to trigger an Azure Function or a web API call.

## Adding Custom Logic with ContentDefinitionReferenceId

Custom logic can also be incorporated into your user journey. For example, you may want to ensure that users accept your website's Terms and Conditions before they can sign in. You can use the ContentDefinitionReferenceId to render a custom web page, just as you might create a checkpoint in your journey where users must stop and agree to the rules before they can proceed.

The "ContentDefinitionReferenceId" item below points at the custom page.
```xml
        <ClaimsProvider>
            <DisplayName>Terms of use</DisplayName>
            <TechnicalProfiles>
                <TechnicalProfile Id="TnCPageNotFirstLogin">
                    <DisplayName>Accept terms of use</DisplayName>
                    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
                    <Metadata>    
                        <Item Key="ContentDefinitionReferenceId">api.tnc-page-first-login</Item>
                    </Metadata>
                    <InputClaimsTransformations>
                        <InputClaimsTransformation ReferenceId="CopyObjectIdToObjectIdCopy" />
                    </InputClaimsTransformations>
                    <InputClaims>
                        <InputClaim ClaimTypeReferenceId="objectIdCopy" />
                    </InputClaims>
                    <OutputClaims>
                        <OutputClaim ClaimTypeReferenceId="objectIdCopy" />
                    </OutputClaims>
                </TechnicalProfile>
            </TechnicalProfiles>
        </ClaimsProvider>
```

The custom page has the ```<div id="api">``` element and Azure B2C will inject UI controls inside the element.
```html
<html>
  <head>
    <title>Sign up</title>
  </head>
  <body>
    <div class="container  self_asserted_container ">
        <div class="row">
            <div class="col-lg-6">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <img alt="Company Logo" class="companyLogo" src="imagens/logoVale.png">
                        <div id="api">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </body>
</html>
```

## Common Predefined TechnicalProfiles

Azure AD B2C provides several out-of-the-box TechnicalProfiles like WeChat-OAuth2, AAD-AssertAccountEnabled, and AAD-DisabledUserPage. These predefined profiles follow a naming convention where the identity provider or feature is prefixed with "AAD-", similar to how books are categorized in a library based on their genre or topic.

## Common Handlers

Handlers in Azure AD B2C act as intermediaries for different processes. They work much like translators, enabling different components of your custom policy to interact seamlessly with each other. Some commonly used handlers include:

1. **Web.TPEngine.Providers.SelfAssertedAttributeProvider:** This handler is responsible for managing the self-asserted attributes in your custom policy. It's like a gatekeeper, making sure that the attributes presented by the user are correct and valid before they are processed further.

2. **Web.TPEngine.Providers.ClaimsTransformationProtocolProvider:** This handler performs transformations on the claims within your custom policy. Think of it as a sculptor, modifying raw clay (claims) into a desired shape (transformed claims) based on the instructions (transformations) provided.

3. **Web.TPEngine.Providers.RestfulProvider:** This handler enables interaction with external APIs or Azure Functions. It acts as a bridge between your custom policy and external functionalities, similar to a courier delivering a package (request) to a distant location (external API) and returning with a receipt (response).

## Technical Profiles

In the world of Azure AD B2C, technical profiles are units of work of your custom policy. They determine the behavior and characteristics of the claims provider, acting as a blueprint for the interactions between the user and the claims provider. They contain a variety of elements:

1. **Protocol:** Specifies the protocol to be used for communication with the other party. It's like selecting the language for a conversation.

2. **Metadata:** Contains the relevant configuration options specific to a protocol, similar to setting the rules of engagement for a protocol.

3. **CryptographicKeys:** A list of cryptographic keys used in the technical profile. These keys can be thought of as secret codes necessary for ensuring secure communication.

4. **InputClaimsTransformations:** A list of transformations that should be executed before any claims are sent to the claims provider or the relying party. These transformations are like pre-processing steps in a production line, ensuring that the input is in the right form before it's processed.

## Logging

Monitoring the execution of your custom policy is crucial for understanding its performance and identifying potential issues. Azure AD B2C allows you to integrate Application Insights for this purpose, acting as a surveillance camera that keeps track of the activities within your custom policy. You can view these logs to gain insight into the user journey and make necessary improvements.


## Summary

In conclusion, Azure AD B2C custom policies offer a robust and flexible way to customize your user journey. By understanding the building blocks and how they fit together, you can construct a policy that caters to your specific requirements, providing a seamless and secure user experience. Happy policy crafting!