---
layout: post
comments: true
title:  "微信提醒通知开发"
date:   2020-01-04 08:00:00 +0800
categories: [中文技术类]
tags: [DevOps, WeChat, Twitter, Facebook]
sharing:
    twitter: "微信提醒通知开发"
    facebook: "微信提醒通知开发"
---

# 场景: 生日祝福
* 创建一个微信Group。
* 获得WeChat GroupId.
* 把这个月过生日的人加进去。（用openid加）
* 发一个优惠
* 等点击

# 场景: 提醒通知
微信的七天一个服务通知的限制不够用。不过有漏洞。
## 更新 2010.01.10
>[「订阅消息」](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html)的更新，意味着用户不再被动地接收信息，小程序消息推送的选择权回到用户手中。以往，当用户选择接收推送后，小程序便不加区分地将服务信息、营销信息统统推送给用户。现在，用户能够自主选择小程序的消息，也可以随时拒收该小程序的服务通知。对于开发者而言，由于用户主动订阅才可以推送消息，**之前通过不断收集formid来发送消息模板的操作将会失效**，小程序开始走向人性化、精细化运营。

>作者：微信极客WeGeek
链接：https://juejin.im/post/5da3ecf1f265da5b5f757dba
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。`

## 老方法
* Any click can be a form submission. 空表单okay。
* 把formid存起来。
* 重复用formid。

[文章一:突破微信小程序模板消息限制，实现无限制主动推送](https://blog.csdn.net/rolan1993/article/details/79398362)

[文章二:微信小程序模板消息还能群发？无限制推送?](https://juejin.im/post/595c82de6fb9a06bba470889)


# Key Takeaway
The technical side of the WeChat platform is constantly changing. It is very time consuming to maintain the same functionalities over time but they have the market.