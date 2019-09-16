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
    Framework - westore: https://github.com/Tencent/westore/blob/master/readme.md#%E5%AE%9A%E4%B9%89%E5%85%A8%E5%B1%80-store

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
