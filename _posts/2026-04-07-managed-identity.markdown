---
layout: post
comments: true
title:  "Managed Identity"
date:   2026-04-07 08:00:00 +0800
categories: Technology
tags: [Power Platform, ALM, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Managed Identity"
    facebook: "Managed Identity"
    linkedin: "Managed Identity"
---

Managed Identity is the next level of service principles because no need to store secrets.

There are inbound and outbound integration and this article will focus on the outbound, meaning from Power Platform to D365.

## Overall Goal
The whole point of creating an MI is so that Azure Entra will trust the target plugin assembly. 

## Step-by-step 

- Cert: generate the pfx file containing the key pair
- Cert: import the pfx as Windows cert
- Azure: create managed identity object with federated credentials and role assignments
- Dataverse: create application user and link to the managed identity record
- Dataverse: add security role 
- Build Plugin dll
- Sign the assembly using cert
- Upload the assembly to Dataverse
- Link the assembly with the managed identity
- Test

### Generate self signed cert
cert contains the key pair (private and public keys). Below is an example.

```powershell
$kuCodeSigning = "1.3.6.1.5.5.7.3.3";

$cert = New-SelfSignedCertificate `
  -Type "CodeSigningCert" `
  -KeyExportPolicy "Exportable" `
  -Subject "VivoAirManagedIdentityPlugin" `
  -KeyUsageProperty @("Sign") `
  -KeyUsage @("DigitalSignature") `
  -TextExtension @("2.5.29.37={text}$($kuCodeSigning)", "2.5.29.19={text}false") `
  -CertStoreLocation "Cert:\CurrentUser\My" `
  -KeyLength 2048 `
  -NotAfter ([DateTime]::Now.AddYears(1)) `
  -Provider "Microsoft Software Key Storage Provider";

$emptyPassword = [System.Security.SecureString]::new()

Export-PfxCertificate `
  -Cert "Cert:\CurrentUser\My\$($cert.Thumbprint)" `
  -FilePath "$env:TEMP\VivoAirManagedIdentityPlugin.cer" `
  -Password $emptyPassword;
```

ku in kuCodeSigning stands for key usage. The example in [msdoc](https://learn.microsoft.com/en-us/power-platform/admin/set-up-managed-identity) is for secure email signage which will not design for signing plugin assemblies. 

You need to register the keys of the generated pfx with Windows certificate storage in both Personal and Root nodes for signing.
![image](../images/2026-04-07-managed-identity/key-storage.png)

### Signing tool
![image](../images/2026-04-07-managed-identity/signtool-windows-sdk.png)

### Create a Managed Identity Record in Dataverse
Do so by create an app user.
![image](../images/2026-04-07-managed-identity/create-managed-identity-record.png)

### Add Federated Security in Azure Managed Idenity
The subject string is used to ping point the intended caller plugin assembly and it formate has changed from v1 to v2. 

## Managed Identity Basics
### User MI and System MI
We create a user MI here

## References
- [Set up managed identity for Power Platform Plugins](https://www.clive-oldridge.com/azure/2024/10/14/set-up-managed-identity-for-power-platform-plugins.html)
- [Power Platform Plugin Package – Managed identity](https://www.clive-oldridge.com/azure/2024/11/22/power-platform-plugin-package-managed-identity.html)
- [Set up Power Platform managed identity for Dataverse plug-ins or plug-in packages](https://learn.microsoft.com/en-us/power-platform/admin/set-up-managed-identity)
- [SignTool.exe (Sign Tool)](https://learn.microsoft.com/en-us/dotnet/framework/tools/signtool-exe)
- [New-SelfSignedCertificate](https://learn.microsoft.com/en-us/powershell/module/pki/new-selfsignedcertificate?view=windowsserver2025-ps#example-3)
