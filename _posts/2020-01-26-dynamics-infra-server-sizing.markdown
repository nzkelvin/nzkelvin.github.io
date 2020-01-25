---
layout: post
comments: true
title:  "Common Audit Scenarios"
date:   2020-01-26 08:00:00 +0800
categories: Technology
tags: [Dynamics, Audit Log, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Ansible DevOps Study Notes"
    facebook: "Ansible DevOps Study Notes"
    linkedin: "Ansible DevOps Study Notes"
---
# Backgroud
Project contract is signed
First thing, Hardware provision

# Goal
Sub-second
3 seconds

# Baseline
* Throughput (requests / minute) VS concurrent user
* S, M, L per tier
* Frontend - 
* Backend - integration

# High Availability and Disaster Recovery
[Gage Pennisi](https://blog.gagepennisi.com/) wrote such a [greate article on Dynamics 365 infrastructure setup for high availability and disaster recovery](https://blog.gagepennisi.com/2017/06/high-availability-and-disaster-recovery.html). Below is my study note.

## High Availability
High Availability means a fall back mechanism if something goes terribly wrong at server level. 

### Dynamics 365 Servers
#### Network Load Balancing
Load balancing is not only for performance improvements but also a way to ensure high availability.

You have two options: Hardware load balancing and software load balancing. Dynamics 365 software load balancing is not a 'true' NLB because it only does a network level round robin. It often fills up one server while starve another server. 

#### Server Backups
It is less sophistcated way to ensure high availability in my opition.

### Dynamics SQL Servers
Since SQL Server 2012 (Enterprise Edition), Always on introduced the concept of Availability Groups. Your Dynamics 365 servers should point at SQL Availability Groups rather than individual SQL servers. 

## Disaster Recovery
Disaster recovery is a fall back plan preparing for an unlikly event of an entire data center is compromised. 

![image](https://3.bp.blogspot.com/-fAZnNZ3vhQs/WWYh1Rwd_oI/AAAAAAAAAnM/x-cGNTKXhN40GR0d7U5i8oiw2qLhXStWACLcBGAs/s1600/69.png)

# Questions for your client
* standard server sizes

# Protect Yourself with Assumptions
## Peak time traffic

# Protect Yourselft with Scopes
## Example: File storage is out of scope

# todo: Merge with High Availability and DR post

