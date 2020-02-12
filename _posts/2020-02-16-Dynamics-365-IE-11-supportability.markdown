---
layout: post
comments: true
title:  "Dynamics 365 IE 11 supportability"
date:   2020-02-01 08:00:00 +0800
categories: Technology
tags: [Dynamics, Data, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Dynamics 365 IE 11 supportability"
    facebook: "Dynamics 365 IE 11 supportability"
    linkedin: "Dynamics 365 IE 11 supportability"
---
Hate is a strong word but sometimes I felt it describe my feeling 

# Supported but not recommended
The official [Dynamics 365 documentation](https://techcommunity.microsoft.com/t5/windows-it-pro-blog/the-perils-of-using-internet-explorer-as-your-default-browser/ba-p/331732) says IE 11 browser is supported but you also need to check requirements for individual apps. Unfortunately, not every app documentation specifies supported browsers and their versions. In that case, I guess we have to refer back to the documentation above.

Chris Jackson from Microsoft [doesn't recommend IE as your default browser](https://techcommunity.microsoft.com/t5/windows-it-pro-blog/the-perils-of-using-internet-explorer-as-your-default-browser/ba-p/331732).

# Nothing Is Free
[The new Microsoft Edge](https://support.microsoft.com/en-us/help/4501095/download-the-new-microsoft-edge-based-on-chromium) (6/Feb/2020) is based on Chromium and Firefox is pretty good at following modern web standards. So maintain a frontend code base to support Chrome, Edge, and Firefox is relatively straight forward.

On the other hand, IE11 is a different beast. It doesn't support many new JS syntaxes, for example the arrow synx

``` javascript
aPromiseObject.then((input) => output);
``` 

You also need to find polyfills for IE11 if they are available. 

You will need to take into account extra test efforts too. Not only because of extra test runs for the browser, IE11 load page a LOT slow than Chrome, FF and Edge. 