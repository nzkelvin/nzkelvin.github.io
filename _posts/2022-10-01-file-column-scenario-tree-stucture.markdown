---
layout: post
comments: true
title:  "Dynamics File Column Scenario: Folder File Tree Structure"
date:   2022-10-01 08:00:00 +0800
categories: Technology
tags: [Microsoft, Dynamics, Power Portal, Azure, Azure China, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Dynamics File Column Scenario: Folder File Tree Structure"
    facebook: "Dynamics File Column Scenario: Folder File Tree Structure"
    linkedin: "Dynamics File Column Scenario: Folder File Tree Structure"
---

## Scenario
### Background
As a resource company, my clients are other businesses in the supply chain. I need to exchange documents with them. For example, I need to send them a contract document, and they need to confirm, sign, and send it back to me.

### Requirement 1
Documents exchange between the company and its client is allowed.

### Requirement 2 - Structure
There are many type of documents, and each type of document has its own folder. For example, there are two types of documents: contract and shipping document. The contract documents are under the "Contracts" folder, and the shipping documents is under the "Shipping Documents" folder.

### Requirement 3 - Access Control
The company's clients can be competitiors, so they are not allowed to access each others documents. The client's representitives can only access their own documents.

Sometimes, especially for small companies, they may share one representitive. In other words, the representitive may represent multiple clients. In this case, the representitive can access the documents of a selection of clients. 

## Design
### Data Model > Overall
![image](../images/2022-10-01-file-column-scenario-tree-stucture/erd.png)

### Data Model > File Node Table
#### kys_FilePath Column
The kys_FilePath column is used to store the full file path. The file path is a string that contains the file name and the folder names. For example, the file path of the contract document is: 

*"~\AccountName\01 Contracts\OpportunityNumber\Contract 1.docx".*

 The file path of the shipping document is:

*"~\AccountName\Shipping Documents\02 Shipping Document 1.docx"*.

Why is it necessary to store the file path in the table? Because the file path is very useful for searching. For example, if I want to search all the contract documents of a specific opportunity, I can use the file path to search.

Another scenario can be for security auditing where one wants to check if someone has access to level 2 folder files but not level 3 folder files.

#### kys_FileNodeTypeCode Column
This column will indicate if a file node is a file or a folder. The value of this column will be either "File" or "Folder".

#### kys_OwnerContactId Column
This column will store who is the (external) uploder of the file. 

### Access Control in Power Portal
A portal defines Ownership by using relationships between entities, and there are five types: Global, Contact, Account, Parent, and Self.

If one representive can only represent on client, the data model can be simpler. However, we need to cater for the representive sharing scenario in the requirement 3. Therefore, it is necessary to have the an extra layer/table, i.e. the kys_FileNodeAccess table.

I can set the permission to the kys_FileNode table to Global, but I will never directly expose the kys_FileNode table to the portal. Instead, I will use the kys_FileNodeAccess table to control which files will be render on the portal.

## Technical Design
### Design Decisions > Note Attachment vs Sharepoint vs Folder Column

#### Note Attachment
I couldn't say it better than Jukkan Niiranen in his blog post (Why would you store images and files in CDS?)[https://jukkaniiranen.com/2019/12/why-would-you-store-images-and-files-in-cds/].
> "As part of the new storage capacity model launched in April 2019, Microsoft will have already migrated all of the attachments previously stored in the SQL database to Azure Blob Storage behind the scenes for any Online environment. However, this doesn’t make the attachments feature any more modern and you should seriously consider not using it in the future (where possible)."

#### Sharepoint
I know that Power Portal / Sharepoint integration is support OOTB. However, the OOTB integration is somewhat rigid in terms of access control based on contacts, or account market, or what not.

#### Folder Column
So, the Folder column is the best choice in my opinion. Plus, it also stores the content in Azure Blob Storage.

### Limitations > File Size
If a file is more than 16 MB, you need to do a little extra work to deal with [chuncking](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/file-attributes?tabs=webapi#example-upload-with-chunking).
