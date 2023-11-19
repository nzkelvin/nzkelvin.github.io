---
layout: post
comments: true
title:  "Enhancing Azure AD B2C Login by Integrating Group Email for TOTP Verification"
date:   2023-09-01 08:00:00 +0800
categories: Technology
tags: [Microsoft, Azure, Web, Power Pages, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Enhancing Azure AD B2C Login by Integrating Group Email for TOTP Verification"
    facebook: "Enhancing Azure AD B2C Login by Integrating Group Email for TOTP Verification"
    linkedin: "Enhancing Azure AD B2C Login by Integrating Group Email for TOTP Verification"
---

In this post, I'll explore how to enhance the Azure AD B2C login process by incorporating a group email feature for TOTP (Time-based One-Time Password) verification. This approach allows companies to manage TOTP verification codes centrally, an essential aspect for organizational security management.

We'll start with the standard login flow, where users input their username and password. Here’s a snapshot of the user interface from Microsoft's example [sign-up or sign-in custom journey](https://b2clivedemo.b2clogin.com/b2clivedemo.onmicrosoft.com/B2C_1A_Demo_SignUp_SignIn_TOTP/oauth2/v2.0/authorize?client_id=cfaf887b-a9db-4b44-ac47-5efff4e2902c&nonce=defaultNonce&redirect_uri=https://jwt.ms&scope=openid&response_type=id_token&prompt=login). 

Normal Azure AD B2C Login
![image](/images/2023-09-01-azure-ad-b2c-group-email-login/normal-aadb2c-login.png)


Next, let's delve into a more sophisticated login flow. In this variation, we require users to input their group email alongside the standard username and password. This is pivotal for sending the TOTP verification code to a company's group email, rather than an individual's personal address.

Group Email Login
![image](/images/2023-09-01-azure-ad-b2c-group-email-login/group-email-login.png)

Initially, I assumed it would be as straightforward as adding an extra OutputClaim for groupEmail in the technical profile:
``` xml
  <TechnicalProfile Id="SelfAsserted-LocalAccountSignin-GroupEmail">
            <DisplayName>Local Account Signin</DisplayName>
            <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
            <Metadata>
                <Item Key="SignUpTarget">SignUpWithLogonEmailExchange</Item>
                <Item Key="setting.operatingMode">Email</Item>
                <Item Key="ContentDefinitionReferenceId">api.selfasserted</Item>
                <Item Key="setting.showSignupLink">false</Item>
            </Metadata>
            <IncludeInSso>false</IncludeInSso>
            <InputClaims>
                <InputClaim ClaimTypeReferenceId="signInName" />
            </InputClaims>
            <OutputClaims>
                <OutputClaim ClaimTypeReferenceId="groupEmail" Required="true" />
                <OutputClaim ClaimTypeReferenceId="signInName" Required="true" />
                <OutputClaim ClaimTypeReferenceId="password" Required="true" />
                <OutputClaim ClaimTypeReferenceId="objectId" />
                <OutputClaim ClaimTypeReferenceId="authenticationSource" />
                <OutputClaim ClaimTypeReferenceId="newUser" PartnerClaimType="newClaimsPrincipalCreated" />
            </OutputClaims>
            <ValidationTechnicalProfiles>
                <ValidationTechnicalProfile ReferenceId="login-NonInteractive" />
            </ValidationTechnicalProfiles>
            <UseTechnicalProfileForSessionManagement ReferenceId="SM-AAD" />
        </TechnicalProfile>
```

However, implementing this was more complex than anticipated. The standard UI rendering did not accommodate the new field properly, leading to layout issues as shown below:

UI Rendering Issue
![image](/images/2023-09-01-azure-ad-b2c-group-email-login/group-email-extra-output-does-not-work.png)

This issue arises because the orchestration step is of the CombinedSignInAndSignUp type, designed only for username and password input. Adding extra fields disrupts the UI's automatic JavaScript and CSS rendering.

The solution, as discussed on [Stack Overflow](https://stackoverflow.com/questions/65501578/azure-b2c-custom-flow-add-field-to-login), involves introducing an additional orchestration step of type ClaimsExchange to collect the group email information:

``` xml
  <OrchestrationStep Order="4" Type="ClaimsExchange">
            <ClaimsExchanges>
                <ClaimsExchange Id="GroupEmailCollection" TechnicalProfileReferenceId="SelfAsserted-GroupEmail" />
            </ClaimsExchanges>
</OrchestrationStep>
```

With this step, we can efficiently collect and store the group email information in the groupEmail claim:

Group Email Orchestration Step
![image](/images/2023-09-01-azure-ad-b2c-group-email-login/group-email-orchestration-step.png)

By adapting our approach, we can successfully integrate the group email feature in the Azure AD B2C login flow, enhancing the security and management of TOTP verification within organizational contexts.