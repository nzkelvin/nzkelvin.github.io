---
layout: post
comments: true
title:  "CI/CD 10,000-Feet Overview"
date:   2021-04-31 08:00:00 +0800
categories: Technology
tags: [DevOps, CI, CD, Azure DevOps]
sharing:
    twitter: "CI/CD 10,000-Feet Overview"
    facebook: "CI/CD 10,000-Feet Overview"
    linkedin: "CI/CD 10,000-Feet Overview"
---

# GitFlow
GitFlow is a popular way of manage code branches. It is a solid start point and can work with CI/CD flows well.

![image](https://datasift.github.io/gitflow/GitFlowHotfixBranch.png)

Source: https://datasift.github.io/gitflow/IntroducingGitFlow.html

# High Level CI/CD flow
[Manual CI] Code review -> [Manual CI] Code pull and rebase -> [Manual CI] Pull request -> [Manual CI] Accept pull request -> [Manual CI] Folk out a release brach 
-> [CI] Run Code Scan -> [CI] Run Unit Tests -> [CI] Send reports -> [CI] Build Packages -> [CI] Restore packages outputs to artefacts repository -> (Optional) [CD] povision containers -> [CD] Deploy to the host servers.

# SonarQube in Azure DevOps
The SonarQube Azure DevOps extension is avaiable in marketplace for free!
![image](../images/2021-04-31-cicd-10000-feet-overview/sonar-qube-azure-devops-extension.png)

# Power Platform Specific Tools
Sparkl

# Provision Containers During the CI/CD Pipeline
Watch the space, please! I will fill this knowledge gap.

# Platforms Comparison

| Purpose | Category | Microsoft | Non-Microsoft |
| ---------------- | ---------------- | ---------------- | ----------------- |
| DevOps Framework | CI | Azure DevOps | Ansible |
| Code Repository | CI | Azure DevOps | Giblab Repository |
| Code Scan | CI | SonarQube | SonarQube |
| Pipleline | CI | Azure DevOps Pipelines | Jenkins Pipelines |
| Package Management | CI | Azure DevOps Artefacts | Nexus |
| Deployment Pipeline | CD | Azure DevOps Pipeline | Ansible Deployment Pipeline |

