---
layout: post
comments: true
title:  "Azure AD B2C Series - 1: App Registation for Power Pages Integration"
date:   2023-04-27 08:00:00 +0800
categories: Technology
tags: [Microsoft, Azure, Web, Power Pages, OpenID, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Azure AD B2C Series - 1: App Registation for Power Pages Integration"
    facebook: "Azure AD B2C Series - 1: App Registation for Power Pages Integration"
    linkedin: "Azure AD B2C Series - 1: App Registation for Power Pages Integration"
---

## Overall Apps

| App name | Purpose |
|---|---|
| IdentityExperienceFramework   | This app hosts AAD B2C Custom Policies |
| ProxyIdentityExperienceFramework | This app is the web proxy of the IdentityExperienceFramework app |
| Policy Tester                 | Use this app to test custom policies with the [jwt.ms](https://jwt.ms/) site |
| b2c-extensions-app            | This app is created automatically and is used by AADB2C for stroing user data in the Graph database |
| Portal CRM                    | This app represents the Power Pages site. It contains Redirect URIs to your Power Pages site. This is how we build trust between the AAD B2C and your Power Pages site. |
| ManagementApp                 | This app it optional. I use it to represent a Azure Function App for extra Azure B2C related functionalities, like data integration |


![image](../images\2023-04-27-aad-b2c-series-1-app-registration\overall-apps-registration.png) 


## Portal CRM App Microsoft Graph API permissions

| API / Permissions name | Type    | Description   | Admin consent required |
|---|---|---|---|
| offline_access   | Delegated  | Maintain access to data you have given it access to  | No |
| openid   | Delegated  | Sign users in  | No  |
| Policy.ReadWrite.AccessReview       | Application| Read and write your organization's directory access review default policy | Yes  |
| Policy.ReadWrite.ApplicationConfiguration | Application| Read and write your organization's application configuration policies | Yes  |
| Policy.ReadWrite.AuthenticationFlows | Application| Read and write authentication flow policies  | Yes  |
| Policy.ReadWrite.AuthenticationMethod | Application| Read and write all authentication method policies   | Yes   |
| Policy.ReadWrite.Authorization     | Application| Read and write your organization's authorization policy        | Yes                    |
| Policy.ReadWrite.ConditionalAccess | Application| Read and write your organization's conditional access policies | Yes                    |
| Policy.ReadWrite.ConsentRequest    | Application| Read and write your organization's consent request policy      | Yes                    |
| Policy.ReadWrite.CrossTenantAccess | Application| Read and write your organization's cross tenant access policies| Yes                    |
| Policy.ReadWrite.ExternalIdentities | Application| Read and write your organization's external identities policy  | Yes                    |
| Policy.ReadWrite.FeatureRollout     | Application| Read and write feature rollout policies                       | Yes                    |
| Policy.ReadWrite.PermissionGrant   | Application| Manage consent and permission grant policies                  | Yes                    |
| Policy.ReadWrite.SecurityDefaults  | Application| Read and write your organization's security defaults policy   | Yes                    |
| Policy.ReadWrite.TrustFramework    | Application| Read and write your organization's trust framework policies   | Yes                    |
| User.EnableDisableAccount.All      | Application| Enable and disable user accounts                              | Yes                    |
| User.Invite.All                    | Application| Invite guest users to the organization                        | Yes                    |
| User.ManageIdentities.All          | Application| Manage all users' identities                                  | Yes                    |
| User.ReadWrite.All                 | Application| Read and write all users' full profiles                       | Yes                    |

## ManagementApp App Microsoft Graph API permissions

|API / Permissions name   | Type   | Description   | Admin consent required |
|---|---|---|---|
|offline_access            | Delegated  | Maintain access to data you have given it access to| No                    |
|openid                    | Delegated  | Sign users in                                     | No                    |
|AuditLog.Read.All         | Application | Read all audit log data                           | Yes                   |
|Directory.Read.All        | Application | Read directory data                               | Yes                   |
|Directory.ReadWrite.All   | Application | Read and write directory data                      | Yes                   |
|Domain.Read.All           | Application | Read domains                                      | Yes                   |
|Domain.ReadWrite.All      | Application | Read and write domains                            | Yes                   |
|Organization.Read.All     | Application | Read organization information                     | Yes                   |
|Organization.ReadWrite.All| Application | Read and write organization information            | Yes                   |
|Policy.Read.All           | Application | Read your organization's policies                  | Yes                   |
|Policy.ReadWrite.TrustFramework| Application | Read and write your organization's trust framework policies | Yes     |
|User.Read.All             | Application | Read all users' full profiles                     | Yes                   |
|User.ReadWrite.All        | Application | Read and write all users' full profiles            | Yes                   |