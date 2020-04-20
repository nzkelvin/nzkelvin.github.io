---
layout: post
comments: true
title:  "Dynamics 365 IFD ADFS and external IdPs"
date:   2020-04-16 08:00:00 +0800
categories: Technology
tags: [OAuth, ws-fed, AD, ADFS, Security, SSO, D365, IFD, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Dynamics 365 IFD ADFS and external IdPs"
    facebook: "Dynamics 365 IFD ADFS and external IdPs"
    linkedin: "Dynamics 365 IFD ADFS and external IdPs"
---

# The Problem
Enterprises with an existing centralised (non-Microsoft) Identify Provider (IdP) may frown upon the idea of introducing another new ADFS based IdP in parallel. 

The standard method is to use an ADFS server both as an IdP and an SP. So are the alternatives? So let's break thing down a bit.

# WS-Fed vs SAML vs OAuth vs OpenID Connect 
WS-Federation: Old school and light weight. Supported by Microsoft and IBM. WS stands for web service.
SAML: Old shool and more complex but perceived to be more secure.
OAuth + OpenID Connect: OpenID Connect adds authorization to OAuth. Azure AD supported OpenID.

Above three are alternative sign-in protocals? The key here is WS-Fed protocal because that is the one Dynamics 365 uses.

## Note to My Futuer Self
Before drowning myself in pot of protocals, ask [the following questions](https://techcommunity.microsoft.com/t5/Core-Infrastructure-and-Security/ADFS-Deep-Dive-Comparing-WS-Fed-SAML-and-OAuth/ba-p/257584):
* What is Sign-in protocal?
* What is the Token Type?

# Decomposing the Components
## ADFS as an SP (Service Provider)
How can you setup an ADFS server as SP for Dynamics 365?

* Configure D365 server for IFD. Define the 3 identifier endpoints (auth.contoso.com, orgname.contoso.com, dev.contoso.com)
* Download the FederationsMetadata.xml
* Import the FederationMetadata.xml to the correspondant ADFS server.

That is right. [The standard setup steps from msdoc](https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/deploy/configure-the-ad-fs-server-for-ifd). 

The default IdP for an ADFS server is Active Directory (AD). However, you can totally use alternative IdPs and make one of them as a primary IdP for the ADFS server.

## ADFS as an IdP (Identity Provider)
The IdP setup of ADFS has nothing to do with D365. It is a pure ADFS configuration.

### Alternative IdP Products/Services
* (RedHat) KeyCloak
* [PingFederate](https://www.pingidentity.com/en/software/pingfederate.html)
* RealMe (service from NZ government)

#### PingFederate
[Microsoft documentation](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-r2-and-2008/gg466930(v=ws.10))

[ADFS can be configured as the claims provider in an WS-Federation with PingFederate as the relying party.](https://support.pingidentity.com/s/article/Configure-ADFS-as-IdP-using-WS-Fed)

#### KeyCloak 
Here is [an Stackoverflow example](https://stackoverflow.com/questions/56632314/keycloak-ad-fs-interaction) of using KeyCloak to act as an SP to an ADFS IdP. I am not sure D365 will work with KeyCloak as an SP.

### Build Custom IdP Adapters
https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/development/ad-fs-build-custom-auth-method

### [Identity Server](https://identityserver4.readthedocs.io/en/latest/)
I will leave this to another blog post. It seems to be relevant. 

## Real World Anecdotes
According to the anecdotes people told me, there are far more failures and successful stories from previous project experiences. Plus, Microsoft will not support such a setup. So, you should definitely put it down as one of the risks of a project.

# SP Initiated SSO vs IdP Initiated SSO
[Best analogy I have seen](https://stackoverflow.com/questions/12779532/differences-between-sp-initiated-sso-and-idp-initiated-sso).

# OAuth Components Responsibilities
Token Server - Sign security tokens with a private key. An ADFS server is a token server and complies with the STS standard.
Authentication Server - Active Directory server is an example of it
Resource Server - Your application server

# Terminologies

| ADFS 2.0 name | PingFederate name | Concept |
| ---------------- | ---------------- | -------------- |
| Security Token | Assertion | A collection of XML-formatted security information, describing a user, that is created and consumed during a federated access request |
| Claims Provider | Identity Provider (IdP) | The partner in a federation that creates security tokens for users |
| Relying Party | Service Provider (SP) | The partner in a federation that consumes security tokens for providing access to applications |
| Claims | Assertion attributes | Data about users that is sent inside security tokens |

Source: https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-r2-and-2008/gg466930(v=ws.10)

STS = Security Token Service (A cross-platform SSO framework standard)
SAML = Security Assertion Markup Language 
JWT = Json Web Token (Encrypted)
OAuth is a authorization Protocal
Claim-based identity is a high level term for describing a way to decouple your application code 

# References
* [WS-Fed vs. SAML vs. OAuth vs. OpenID Connect](https://nirajrules.wordpress.com/2016/03/05/ws-fed-vs-saml-vs-oauth-vs-openid-connect/)