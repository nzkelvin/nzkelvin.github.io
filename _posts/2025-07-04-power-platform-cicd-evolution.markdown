---
layout: post
comments: true
title:  "Power Platform CICD Evolution"
date:   2025-07-04 08:00:00 +0800
categories: Technology
tags: [Power Platform, ALM, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Power Platform CICD Evolution"
    facebook: "Power Platform CICD Evolution"
    linkedin: "Power Platform CICD Evolution"
---

## Why CI/CD and ALM?
We need CI/CD and ALM in Power Platform to move from ad‑hoc manual exports/imports to predictable, governed delivery.

## Key Pillars
### Development Experience
* Plugin Registration
* Codegen
* Unpack Solutions
* Pack Solutions

### Strategies
#### Solution Segregation
Option 1: Split by Features
But you will still need a core solution for shared components, and if the core solution becomes too big, you need to split it.

Option 2: Split by Components
Customization, Plugin, Workflows and etc.

#### Layering
The final product is like a cake and each solution is like a layer of the cakse. The solution importing sequence is important because it dictates if and how solution layer are stacked and which overwrite which. 

### CICD Experience
* Deployment targeting - you can target multiple systems, so called fan out. You can keep the deployment mapping configration in the json.
* PR merge gate with Pre-validation and code review.
* Deployment gate - approver before deployment goes ahead
* Deploy - ADO stages and steps and tools.
* Post Deploy - master data import

## Evolution
### Manually export solutions in a folder
Back in the bad old days, the packaging are handled manually, meaning the dev team will manually export solutions and put them in a folder in the source repository. Later the CICD pipeline will deploy the solutions from the repo. Optionally, you can provide CICD pipeline with powershell scripts to unpack the zip solution and inject the built plugin dlls and re-package.

### Code Based Package
We moved away from committing exported solution .zip files. Instead we use PowerShell with the pac CLI to unpack solutions and commit only the unpacked XML (solution definition) to source control. This gives us:
* Meaningful diffs (component level instead of opaque binaries)
* Better traceability (who changed which attribute/artifact)
* Easier observability and code review

Discipline is critical. The unpacked solution definition in git must always mirror the originating environment. When drift appears, developers are tempted to hand‑edit XML to “force” a change into the next environment—slow, brittle, and error‑prone.

Repository & branching: all squads contribute to the same repository and share a single release/trunk branch (with short‑lived feature branches). We previously experimented with letting squads keep divergent copies of the same solution for “parallel development” and then hand‑merge XML. Outcome: frequent pipeline failures, sprawling merge conflicts across many XML files, and elongated release cycles.

Lessons learned:
1. Don’t manually merge unpacked solution XML. Treat the environment as source of truth; always re‑export/unpack/overwrite instead of editing.
2. Maintain one authoritative branch lineage per solution; avoid long‑running parallel variants.
3. Automate sync validation (pre‑PR or pipeline) to catch drift early.
4. Flow changes forward only (dev → test → prod). Avoid reverse edits by hacking XML.
5. Make pack/unpack scripts idempotent and run them locally and in CI to eliminate divergence.

Core principle: no code‑level merging of solution definitions; solution evolution moves one way toward higher environments.

### PPDO
[Power Platform Devops](https://github.com/microsoft/powerplatform-build-tools) is community initiated toolkit which helps with packing, unpacking, codegen, configuration data export and other packing related tasks.

### ALM accelerator 
[ALM Accelerator for Power Platform](https://learn.microsoft.com/en-us/power-platform/guidance/alm-accelerator/overview) is microsoft initiated toolkit which helps with packing, unpacking, deployment mapping, pipeline yaml templates and etc.


### Power Platform native git integration
[Git integration in Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/git-integration/overview) is the Power Platform native support for solution sync and deployment.