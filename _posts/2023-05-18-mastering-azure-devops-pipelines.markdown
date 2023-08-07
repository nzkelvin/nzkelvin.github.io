---
layout: post
comments: true
title:  "Mastering Azure DevOps Pipelines"
date:   2023-05-18 08:00:00 +0800
categories: Technology
tags: [Microsoft, Azure, Azure DevOps, CICD, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Mastering Azure DevOps Pipelines"
    facebook: "Mastering Azure DevOps Pipelines"
    linkedin: "Mastering Azure DevOps Pipelines"
---
# Mastering Azure DevOps Pipelines: Common Tasks for Developers"

Azure DevOps Pipelines is a powerful service that enables continuous integration and delivery for your applications. In this post, we will explore some key aspects of using Azure DevOps Pipelines, specifically around restore and build tasks. 

## Azure DevOps Pipeline Building Blocks
Azure DevOps pipelines are made up of several key components or building blocks:

1. **Pipeline**: This is the overall workflow that you define to build, test, and deploy your application. It's the top-level component that contains all the other building blocks.

2. **Stages**: A pipeline can be divided into stages, each of which represents a phase of the pipeline, such as Build, Test, or Deploy. Stages can depend on each other and can be run conditionally.

3. **Jobs**: Each stage contains one or more jobs. A job is a series of steps that run sequentially on the same agent. Jobs can run in parallel or sequentially and can be dependent on the success of a previous job.

4. **Steps**: These are the smallest building block of a pipeline and represent individual tasks that do the actual work, such as executing a script or a command-line tool, or running a build or deployment task.

5. **Tasks**: Tasks are pre-packaged scripts that perform a specific action, such as invoking a REST API, copying files, or building a .NET project. Azure DevOps provides a library of built-in tasks for common scenarios, and you can also create your own custom tasks.

6. **Agents**: An agent is a computing environment where jobs are executed. Imagine an Agent is a computer. Agents can be hosted by Azure DevOps (Microsoft-hosted agents) or by your own infrastructure (self-hosted agents).

7. **Variables**: Variables allow you to store values that you can use throughout your pipeline. They can be defined at the pipeline, stage, or job level.

8. **Artifacts**: Artifacts are the files that you want your pipeline to produce. Artifacts can be used in subsequent stages of the pipeline, or they can be downloaded for use outside of the pipeline.

9. **Triggers**: Triggers define when a pipeline should run. You can configure a pipeline to run automatically when changes are pushed to your repository (CI triggers), when a specific event occurs, or on a schedule.

10. **Service Connections**: These are connections to external systems or services that your pipeline needs to interact with, such as Azure subscriptions, Docker registries, or GitHub repositories.

These building blocks can be combined in many ways to create complex and powerful CI/CD workflows.

## A Real World Example
The YAML Azure DevOps pipelines does the following things:

- It kicks off whenever there is a change in the dev branch of your Git repository. 
- It sets up a few pipeline-scoped variables.
- Then it sets up a build environment using windows-2019 image.
- The Build stage compiles the .NET Core project, produces a ZIP archive of the output, and then publishes the ZIP as a pipeline artifact.
- If the Build stage was successful, the Deploy_DEV stage kicks off:
  - It uses the same VM image as the build stage.
  - It deploys the ZIP artifact to an Azure Function App in the 'Azure Vale CRM DEV' environment.

The deployment uses a service connection (sc-rg-crm-dev) to authenticate with Azure; 

```Yaml
name: functions-portals-DEV-$(Date:yyyyMMdd)-$(Rev:r)

resources:
  repositories:
  - repository: self
    type: git
    trigger:
      branches:
        include:
        - dev
      paths:
        include:
        - src/*
        exclude:
        - README.md

variables:
- name: functionAppName
  value: 'kys-portal-fn-dev'
- name: serviceConnection
  value: 'sc-rg-crm-dev'
- name: vmImageName
  value: 'windows-2019'
- name: buildConfiguration
  value: 'Release'
- name: workingDirectory
  value: 'src/KelvinBytes.CRM.Portal.Functions'
- name: systemName
  value: Portals

pool:
  vmImage: $(vmImageName)

stages:
- stage: Build
  displayName: Build stage

  jobs:
  - job: Build
    displayName: Build
    
    workspace:
      clean: all

    pool:
      vmImage: $(vmImageName)

    steps:

    - task: UseDotNet@2
      displayName: 'Install .NET Core SDK'
      inputs:
        version: 3.1.x
        includePreviewVersions: false

    - task: DotNetCoreCLI@2
      displayName: 'dotnet restore'
      inputs:
        command: restore
        projects: '**/*.sln'

    - task: DotNetCoreCLI@2
      displayName: 'dotnet build'
      inputs:
        command: 'build'
        projects: |
          $(workingDirectory)/*.csproj
        arguments: --output $(System.DefaultWorkingDirectory)/publish_output --configuration $(buildConfiguration)

    - task: ArchiveFiles@2
      displayName: 'Archive files'
      inputs:
        rootFolderOrFile: '$(System.DefaultWorkingDirectory)/publish_output'
        includeRootFolder: false
        archiveType: zip
        archiveFile: $(Build.ArtifactStagingDirectory)/$(systemName)-v$(Build.BuildId).zip
        replaceExistingArchive: true

    - publish: $(Build.ArtifactStagingDirectory)/$(systemName)-v$(Build.BuildId).zip
      artifact: drop

- stage: Deploy_DEV
  displayName: Deploy DEV
  dependsOn: Build
  condition: succeeded()

  jobs:
  - deployment: Deploy
    displayName: Deploy
    environment: 'Azure KelvinBytes CRM DEV'
    variables:
      - group: kelvinbytes-crm-portal-functions-dev
    pool:
      vmImage: $(vmImageName)
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureFunctionApp@1
            displayName: 'Azure functions app deploy'
            inputs:
              azureSubscription: $(serviceConnection)
              appType: functionApp
              appName: $(functionAppName)
              package: $(Pipeline.Workspace)/drop/$(systemName)-v$(Build.BuildId).zip
```

## NuGetCommand@2 vs DotNetCoreCLI@2 for Restore Tasks

When restoring NuGet packages in your Azure DevOps Pipeline, you have a choice between using the `NuGetCommand@2` task and the `DotNetCoreCLI@2` task.

**NuGetCommand@2** is a task that runs a specified NuGet command. When used with the `restore` command, it restores NuGet packages based on the `packages.config` file or the `PackageReference` in your project files.

```yaml
- task: NuGetCommand@2
  inputs:
    command: 'restore'
    restoreSolution: '**/*.sln'
```

On the other hand, **DotNetCoreCLI@2** is a task that runs a specified dotnet command. When used with the `restore` command, it restores NuGet packages based on the `PackageReference` in your project files.

```yaml
- task: DotNetCoreCLI@2
  inputs:
    command: 'restore'
    projects: '**/*.sln'
```

Both tasks can restore packages for a solution, but `DotNetCoreCLI@2` has the advantage of being able to restore packages for .NET Core and .NET 5+ projects without needing a `nuget.config` file.

However, if you're working with .NET Core projects (especially .NET Core 3.1.x and later), it's important to note that `NuGetCommand@2` might encounter issues. The task may complain about .NET version mismatches and fail to compile the project. This is likely due to the older version of NuGet used by the `NuGetCommand@2` task, which may not fully support newer .NET Core versions.

In this case, it's recommended to use `DotNetCoreCLI@2` for both restoring and building .NET Core projects. This task uses the dotnet CLI, which is fully compatible with .NET Core and .NET 5+, and generally provides smoother and more reliable operations for these project types.

Having said that, NuGetCommand@2 can be used to execute any NuGet command, not just restore. This includes push, pack, spec, delete, and locals, giving you access to the full suite of NuGet functionality directly from your Azure Pipelines. DotNetCoreCLI@2 only covers a subset of these commands that are available via the dotnet CLI.

## Restoring by nuget.json vs Restoring by Solution File

Another point of comparison is whether to restore packages based on a `nuget.config` file or a solution file.

Restoring based on a `nuget.config` file means that the restore task will use the feeds specified in the `nuget.config` file to restore packages. This is useful when you need to restore packages from multiple feeds or private feeds.

Restoring based on a solution file means that the restore task will restore packages for the projects in the solution. The task uses the `PackageReference` in the project files to determine which packages to restore. This is more straightforward and doesn't require a `nuget.config` file, unless you need to restore packages from feeds other than the default NuGet feeds.

## VSBuild@1 vs DotNetCoreCLI@2 for Build Tasks

Lastly, we'll compare the `VSBuild@1` task and the `DotNetCoreCLI@2` task for building your projects.

**VSBuild@1** is a task that uses MSBuild to build Visual Studio project and solution files.

```yaml
- task: VSBuild@1
  inputs:
    solution: '**/*.sln'
    platform: 'Any CPU'
    configuration: 'Release'
```

**DotNetCoreCLI@2**, when used with the `build` command, uses the `dotnet build` command to build .NET Core and .NET 5+ projects.

```yaml
- task: DotNetCoreCLI@2
  inputs:
    command: 'build'
    projects: '**/*.sln'
    arguments: '--configuration Release'
```

While both tasks can build your projects, `DotNetCoreCLI@2` has the advantage of being able to build .NET Core and .NET 5+ projects, and it's more aligned with the command-line experience of .NET Core and .NET 5+.

In conclusion, the choice between `NuGetCommand@2` and `DotNetCoreCLI@2` for restore tasks, restoring by `nuget.config` vs solution file, and `VSBuild@1` vs `DotNetCoreCLI@2` for build tasks depends on your specific needs and the type of projects you're working with. By understanding these options, you can configure your Azure DevOps Pipeline to best fit your needs.