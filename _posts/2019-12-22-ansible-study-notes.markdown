---
layout: post
comments: true
title:  "Ansible DevOps Study Notes"
date:   2019-12-22 08:00:00 +0800
categories: Technology
tags: [DevOps, CICD, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Ansible DevOps Study Notes"
    facebook: "Ansible DevOps Study Notes"
    linkedin: "Ansible DevOps Study Notes"
---
Ansible is a popular choice of DevOps tools.

# History
* Ansible was created by Michael DeHaan in 2012.
* Ansible was acquired by Red Had in 2015.

# Ansible vs Ansible Tower
So what are the differences? 

Ansible is the engine of the tool. You can access it via command-line user interfaces.

Ansible Tower is a web based UI for Ansible. You can trigger an Ansible playbook from an Ansible Tower website.

# Mechanism
An Ansible Server is a controller. It is the brain of the tool. It pushes deployments to the nodes under its control.

An Ansible server is Linux based, i.e. you need a Linux server / box to install it.

However, the target nodes can run on either Linux or Windows OS.

Microsoft PowerShell Desired State of Configuration (DSC) supports both the "push" and the "pull" methods. However, Ansible only does "push", which means it less flexible but leave no trace on the target nodes post deployments .

## Scripts
"Infrastructure as Code" is the goal. Microsoft PowerShell Desired State of Configuration is powered by PowerShell scripts. In comparison, Ansible has a concept called Playbooks and they are saved in
the YMAL file format. An YMAL file consists of both configuration and scripting in a declarative way.

# Limitation of DevOps
No all applications / systems are made for DevOps. For example, systems like SAP has it own deployment mechanmism (Transports) and are incompatible with modern DevOps tools.

Some companies only do DevOps internally, and external product release cadance is still around once a year.

## Limitation of 
Ansible is incapable of deploying to client nodes, e.g. mobile device. It is because you cannot guarantee they are always on.

# Dependents Management
[JFrog Artifactory](https://jfrog.com/artifactory/) is a popular tool for storing packages, installation files and scripts. 

# Job Roles
In an ideal world, DevOps should have its own dedicated team. However, in reality, we often see development teams make DevOps scripts and packages. BAU teams will pretty much just click buttons for production releases.

# Cloud Integration
The major cloud vendors, like Azure and AWS, all support Ansible natively.

# Bonus: A Checklist for Planning Your DevOps Capability
* Requirements management system, e.g. Jira.
* Technology stack and tool chains.
* IT system environments. Use VMs? Use Containers?
* IT system monitoring tools, e.g. Zabbix, Splunk, and APM
* CI: Source code version control tools, check-in policy.
* CI: Code quality control, e.g. unit test, integration test, UI tests and static code analysis (SonarQube).
* CI: Build tools.
* CD: Dependency management, e.g. JFrog Artifactory.
* CD: Security certification renewal.
* CD tool chain.
