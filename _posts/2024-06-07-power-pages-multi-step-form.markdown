---
layout: post
comments: true
title:  "Power Pages Multi-Step Form"
date:   2024-06-07 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Dataverse, Dynamics, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Power Pages Multi-Step Form"
    facebook: "Power Pages Multi-Step Form"
    linkedin: "Power Pages Multi-Step Form"
---

## Business Scenario
Power Pages Multi-Step Form can be useful in scenarios where you want to break down a long form into multiple steps. For example, for making a medical insurance claim, you may want to break down the form into multiple steps like Personal Information, Incident Details, Support Document, etc. This can help in improving the user experience and also in capturing the information in a structured manner.


## Building Blocks - Metadata
You can use both Power Pages designer and the Portal Management Portal app to create a multi-step form. Some of the advhanced configurations can be done only using the Portal Management Portal app. 

## UI/UX and the Progress Indicator
The out of the box looking and feel of the multi-step form is something similar to the screenshot below. 

![image](../images/2024-06-07-power-pages-multi-step-form/progress-indicator.jpg)

### Heavy Customization
You can use custom CSS to make it look better. However, in case the UI/UX requirements are complex, you may need build your own. A possible approach could be

1. Put an anchor HTML element in the "Copy (HTML)" field of the page. ![image](../images/2024-06-07-power-pages-multi-step-form/multistep-form-web-page.png)
2. Use JavaScript of the Web Page to control the visibility of the old progress indicator as well as inject DOM elements for the new progress bar. ![image](../images/2024-06-07-power-pages-multi-step-form/multistep-form-web-page-javascript.png)

Note: It is impossible to add custom JavaScript at the Multi Step form level. However, you can add custom JavaScript at both the Web Page level and the Form Step level.

### Conditional Steps
For example, for a specialist doctor insurance claim, you may want to show a extra step for support documents.

[Tutorial: Add a multistep form to your page](https://learn.microsoft.com/en-us/power-pages/getting-started/tutorial-add-multi-step-form)

## Session Managment
You may ask if a user only partially completed a multi step form, will the status be preserved? The answer is yes. The session management is taken care of by the Power Pages.

![image](../images/2024-06-07-power-pages-multi-step-form/multistep-form-session-management.png)

## Validation
[Client Side Field Level Validation](https://learn.microsoft.com/en-us/power-pages/configure/add-custom-javascript#additional-client-side-field-validation)
[Client Side Form Level Validation](https://learn.microsoft.com/en-us/power-pages/configure/add-custom-javascript#general-validation)

## Interesting Readings
* [Power Pages: Pro Code Techniques in the Templates – Custom Saving on Forms with JavaScript and Web API](https://community.dynamics.com/blogs/post/?postid=24fc30a0-881e-43ec-893d-992185f6455e)
* [Power Pages Tip #185 - JavaScript on Power Pages Forms - Engineered Code](https://www.youtube.com/watch?v=3hUXz_e4jdc)
* [Power Pages Tip #186 - Adding Custom Validators to Forms - Engineered Code](https://www.youtube.com/watch?v=EHfJVFKgolg)
* [Power Pages Tip #187 - JavaScript on Power Pages Lists - Engineered Code](https://www.youtube.com/watch?v=AE6-BURiSgg)
