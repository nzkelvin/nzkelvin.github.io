---
layout: post
comments: true
title:  "Azure AD B2C Custom Policy Internal Server Error and UserInputType"
date:   2023-10-20 08:00:00 +0800
categories: Technology
tags: [Microsoft, Azure, Web, Power Pages, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Azure AD B2C Custom Policy Internal Server Error and UserInputType"
    facebook: "Azure AD B2C Custom Policy Internal Server Error and UserInputType"
    linkedin: "Azure AD B2C Custom Policy Internal Server Error and UserInputType"
---

## Problem
```xml
        <TechnicalProfile Id="AzureFunctionApp-GetLoginEmailList">
          <DisplayName>Get all login emails allowed of a portal user - including individual and group emails</DisplayName>
          <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
          <Metadata>
            <Item Key="ServiceUrl">https://fake-url.azurewebsites.net/api/GetLoginEmailList</Item>
            <!-- Set AuthenticationType to Basic or ClientCertificate in production environments -->
            <Item Key="AuthenticationType">None</Item>
            <!-- REMOVE the following line in production environments -->
            <Item Key="AllowInsecureAuthInProduction">true</Item>
            <Item Key="SendClaimsIn">QueryString</Item>
          </Metadata>
          <InputClaimsTransformations>
            <InputClaimsTransformation ReferenceId="CheckIfHasWeChatPresent" />
            <InputClaimsTransformation ReferenceId="SetGroupEmailDefaultClaimValue" />
          </InputClaimsTransformations>
          <InputClaims>
            <InputClaim ClaimTypeReferenceId="extension_CrmContactId" PartnerClaimType="contactId" />
          </InputClaims>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="LoginEmailList" PartnerClaimType="loginEmailList" />
            <OutputClaim ClaimTypeReferenceId="IsLoginTypeIndividualOnly" PartnerClaimType="isLoginTypeIndividualOnly" />
            <OutputClaim ClaimTypeReferenceId="IsLoginTypeGroupEmailOnly" PartnerClaimType="isLoginTypeGroupEmailOnly" />
            <OutputClaim ClaimTypeReferenceId="IsGroupEmailSignUp" PartnerClaimType="isGroupEmailSignUp" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CheckWeChatAndGroupEmailOnlyLogin" />
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
        </TechnicalProfile>
```

## Error Message
The page cannot be displayed because an internal server error has occurred.
![image](../images/2023-10-20-aad-b2c-custom-policy-internal-server-error-userinputtype/custom-policy-missing-userinputtype-runtime-error.png)

## Cause
Missing UserInputType

## Solution
Add UserInputType to the claim type.

```xml
      <ClaimType Id="IsGroupEmailSignUp">
          <DisplayName>Is in the group email sign-up flow?</DisplayName>
          <DataType>boolean</DataType>
          <UserInputType>Readonly</UserInputType>
      </ClaimType>
```

### What UserInputType to use?
https://learn.microsoft.com/en-us/azure/active-directory-b2c/claimsschema#userinputtype