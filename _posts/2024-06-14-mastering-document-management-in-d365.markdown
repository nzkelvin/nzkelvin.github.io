---
layout: post
comments: true
title:  "Mastering Document Management in Dynamics 365"
date:   2024-06-14 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Dataverse, Dynamics, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Mastering Document Management in Dynamics 365"
    facebook: "Mastering Document Management in Dynamics 365"
    linkedin: "Mastering Document Management in Dynamics 365"
---

## Generate PDF Documents from HTML
### Why HTML to PDF Conversion?

- **Flexibility**: HTML gives you fine-grained control over document layout, including fonts, images, tables, and styling.
- **Platform Independence**: PDFs can be viewed and printed consistently across any operating system or device.
- **Automation**: You can programmatically generate PDFs from HTML within your D365 workflows or web applications.

### Solutions for PDF Generation

Let's take a look at a few options for converting HTML to PDF, each with its own strengths:

#### Apryse Server SDK
One of the [Apryse Server SDK's](https://docs.apryse.com/documentation/samples/#html2pdf) capability is to convert Html2Pdf. Please note it is a commercial product which costs money.

#### Select.HtmlToPdf
[Select.HtmlToPdf](https://selectpdf.com/community-edition/) is a free .NET library that can be used to convert any web page or HTML to PDF. The community edition is free and can generate PDFs up to 5 pages long.

Here is [the Select.HtmlToPdf nuget package](https://www.nuget.org/packages/Select.HtmlToPdf/).

#### IronPDF
[IronPDF](https://ironpdf.com/) is another commercial .NET library that can be used to convert HTML to PDF. 

### Document Generation within Dynamics 365
#### D365 OOTB Word Template
* Step 1: [Use Word templates to create standardized documents](https://learn.microsoft.com/en-us/power-platform/admin/using-word-templates-dynamics-365)
* Step 2: [Export sales records to PDF](https://learn.microsoft.com/en-us/dynamics365/sales/create-quote-pdf)

#### DocumentsCorePack
[DocumentsCorePack](https://www.mscrm-addons.com/language/de-DE/Solutions/DocumentsCorePack) is a commercial solution that can be used to generate documents in Dynamics 365. It comes with Microsoft Word based document template designer and supports more complex data query than the OOTB D365 Word templates, for example, it can link data tables more 2 levels deep. Further more, it is capable of generateing documents in PDF format. 

## Enhancing PDFs with Annotation
This is another common scenario. Fortunately, The [Apryse WEBVIEWER - Web SDK's PDF Annotation Library](https://docs.apryse.com/documentation/web/guides/annotation/) can support this ask and it keeps annotations separate from their host document. 

## Document Storage
For integrating Apryse WEBVIWER with D365, I will recommend Azure blob storage to save your documents.

## Electronic Signatures for Documents
The most famous e-signature solution is Adobe Acrobat Sign and [Docusign](https://www.docusign.com/).

## Navigating the Apryse Product Structure
### XoDo
Xodo is end-user application. It has an independent website.

### Apryse
Apryse is a series of products for developers. It consists of a frontend library called WEBVIEWER - Web SDK and a backend library called SERVER SDK.