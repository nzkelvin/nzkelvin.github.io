---
layout: post
comments: true
title:  "IFD without ADFS"
date:   2020-04-16 08:00:00 +0800
categories: Technology
tags: [OAuth, AD, ADFS, Security, SSO, D365, IFD, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "IFD without ADFS"
    facebook: "IFD without ADFS"
    linkedin: "IFD without ADFS"
---

# The Problem
Enterprises with an existing centralised (non-Microsoft) Identify Provider (IdP) may frown upon the idea of introduce a new ADFS IdP. 

So is it possible to setup an D365 IFD with an ADFS alternative?

The short answer is yes. The alternative IdP need to support the following:
* STS
> [An STS server can be based on Active Directory Federation Services (AD FS) V2, or any platform that provides the official STS protocol.](https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/active-directory-claims-based-authentication)
* AD Integration

# Products
* (RedHat) KeyCloak
* [PingFederate](https://www.pingidentity.com/en/software/pingfederate.html)

# Responsibilities
Token Server - Sign security tokens with a private key. ADFS server is a token server and complies with the STS standard.
Authentication Server - Active Directory server is an example of it
Resource Server - Your application server

# Terminologies
SP = Service Provider (SSO frontend)
IdP = Identity Provider (SSO backend)
STS = Security Token Service (A cross-platform SSO framework standard)
SAML = Security Assertion Markup Language 
JWT = Json Web Token (Encrypted)
OAuth is a authorization Protocal
Claim-based identity is a high level term for describing a way to decouple your application code 