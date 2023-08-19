---
layout: post
comments: true
title:  "Plugin Registration Tool Login with MFA"
date:   2023-06-01 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Dataverse, Authentication, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Plugin Registration Tool Login with MFA"
    facebook: "Plugin Registration Tool Login with MFA"
    linkedin: "Plugin Registration Tool Login with MFA"
---
## MFA Login Error
When you try to create a Plugin Registration Tool connection using a user with MFA enabled, you may get the following error:

```
Source	: Not Provided
Method	: Not Provided
Date	: 8/14/2023
Time	: 2:08:41 PM
Error	: You don't have permission to access any of the organizations in the Microsoft Common Data Service region that you specified. If you're not sure which region your organization resides in, choose "Don't know" for the CDS region and try again. Otherwise check with your CDS administrator.
Stack Trace	: Not Provided
======================================================================================================================

```

## Solution
All you need to do is to leave the User Name and the Password fields blank, and click Login. You will be prompted to enter your credentials in a pop-up window. After you enter your credentials, you will be prompted to enter the code from your authenticator app. After you enter the code, you will be logged in successfully.

![image](../images/2023-06-01-plugin-registration-tool-login-with-mfa/login-leave-blanks.png) 

![image](../images/2023-06-01-plugin-registration-tool-login-with-mfa/login-pop-up.png) 

## Reference
- http://www.bwmodular.org/blog/using-the-plugin-registration-tool-with-mfa-enabled-accounts-in-dynamics-365