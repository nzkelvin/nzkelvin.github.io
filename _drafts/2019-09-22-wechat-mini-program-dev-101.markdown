---
layout: post
comments: true
title:  "WeChat Mini Program Development 101"
date:   2019-09-22 08:00:00 +0800
categories: Technology
tags: WeChat Marketing
---
Dev Mode: "Does no verify valid domain names"

Backend: Azure Functions

Authentication: 
    Method 1: Using Tencent Cloud functions

    Method 2: The official documented method
        * temp code (five minute)
        How can a custom backend make everything secure?
        * Custom backend will construct a custom login status code
        * Custom backend URI is whitelist in the Mini App configuration
        * WeChat session code should never expose to the client side.

    * You can get a openid without getUserInfo but you will not have the avatar url

Authorisation: 
{% highlight javascript %}
wx.authorize({scope: "scope.userInfo"})，不会弹出授权窗口，请使用 <button open-type="getUserInfo"/>
{% endhighlight %}

    UserInfo - You need a button > wx.getUserInfo
    UserInfo - encryption? [Decryption][https://blog.csdn.net/ivanyoung66/article/details/72523231]

Local Storage:
    Global Level: app.globalData.userInfo = e.detail.userInfo. Good for session ID.
    Page Level: this.setData
        this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
        })
    Framework for component level global storage management - westore: https://github.com/Tencent/westore/blob/master/readme.md#%E5%AE%9A%E4%B9%89%E5%85%A8%E5%B1%80-store
        Template code: https://github.com/Tencent/westore/tree/master/packages/westore

WXML:
    * Standard doc
    * top component <view>
    * Block = ASP.NET panel
    * 

Authorisation:
    * getUserInfo
            <button wx:if="{{!hasUserInfo && canIUse}}" open-type="getUserInfo" bindgetuserinfo="getUserInfo">获取头像昵称</button>
    * getPhoneNumber
            <button open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber">Allow access to phone number</button>
    * wx.authorize // Normal
    * temp mini program code: When on application load. Only lasts 5 minutes
    * Openid: from backend. How? Call a Tencent cloud function
    * sessionId: never give it to the client side
    * UserInfo: how? from a control (open-type=???)

npm packages:
    * npm init -y // creates an package.json under the root folder
    * 先在文件目录下npm init -y 初始化，再npm install 你要下载的包，然后小程序右上角详情中，把使用npm模块钩上
    * npm init something
    * Tools > Build npm
    * check application level package.json is updated (project level > application level)
    * update cloud function / page level module package.json
    * require('package-name')
    * package.json is at the app level not the proj level
    * https://blog.csdn.net/CherryCola_zjl/article/details/89878741
    * https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html

mini Programe Cloud
    * Call 3rd party web function - https://developers.weixin.qq.com/community/develop/doc/000e26e2d648b04cb6d71c5ad5d000?_at=1559174400032

Mini app life cycle:
    * Don't put app initial logic in app.js. no way to debug it. Put the app level initial logic in the index.js

JS Lesson learnt 
    * 'request' doesn't support Promise
    * I should have used request-promise
    * I used the 'got' npm at the end. It works good.
https://blog.csdn.net/qq_36935391/article/details/89391488
    * module.exports has to be at the bottom of the file

Navigation
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })

UI
weui.io = boot strap

JavaScript
    * 
    * Async...Await
        ** Async return a promise object
        ** await blocks the following code which async function is executing
        ** You can only use await inside an async
        ** await makes async code looks like sync code by adding syntactic sugar
        ** You should use async functions everywhere except all event handlers, e.g. onload.
    * let vs var. let respects code blocks


小程序云开发
    * Function setting has timeouts

API Dev
    * Security: whitelist on the api/server side
    * Security: custom token generation logic