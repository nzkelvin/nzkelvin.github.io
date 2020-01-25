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

# 场景: 提醒通知

## 模板消息
[官方文档](https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Template_Message_Interface.html)

```
关于使用规则，请注意：

# 所有服务号都可以在功能->添加功能插件处看到申请模板消息功能的入口，但只有认证后的服务号才可以申请模板消息的使用权限并获得该权限；
# 需要选择公众账号服务所处的2个行业，每月可更改1次所选行业；
# 在所选择行业的模板库中选用已有的模板进行调用；
# 每个账号可以同时使用25个模板。
# 当前每个账号的模板消息的日调用上限为10万次，单个模板没有特殊限制。【2014年11月18日将接口调用频率从默认的日1万次提升为日10万次，可在MP登录后的开发者中心查看】。当账号粉丝数超过10W/100W/1000W时，模板消息的日调用上限会相应提升，以公众号MP后台开发者中心页面中标明的数字为准。
```


## 老方法 - 非服务号
微信的七天一个服务通知的限制不够用。不过有漏洞。
### 更新 2020.01.10
>[「订阅消息」](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html)的更新，意味着用户不再被动地接收信息，小程序消息推送的选择权回到用户手中。以往，当用户选择接收推送后，小程序便不加区分地将服务信息、营销信息统统推送给用户。现在，用户能够自主选择小程序的消息，也可以随时拒收该小程序的服务通知。对于开发者而言，由于用户主动订阅才可以推送消息，**之前通过不断收集formid来发送消息模板的操作将会失效**，小程序开始走向人性化、精细化运营。

>作者：微信极客WeGeek
链接：https://juejin.im/post/5da3ecf1f265da5b5f757dba
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。`

### Old Notes
* Any click can be a form submission. 空表单okay。
* 把formid存起来。
* 重复用formid。

[文章一:突破微信小程序模板消息限制，实现无限制主动推送](https://blog.csdn.net/rolan1993/article/details/79398362)

[文章二:微信小程序模板消息还能群发？无限制推送?](https://juejin.im/post/595c82de6fb9a06bba470889)


# 场景: 生日祝福
* 创建一个微信Group。
* 获得WeChat GroupId.
* 把这个月过生日的人加进去。（用openid加）
* 发一个优惠
* 等点击

# 场景： 墨迹天气
点开“墨迹天气”微信小程序，自动push所在地区域天气的功能。

Don't know how yet.


# 场景：[“深圳天气”微信服务号](https://www.zhihu.com/question/23216690)
点开“深圳天气”微信服务号，自动push所在地区域天气的功能。

* 原理是使用获取地理位置的接口，每次打开会话界面就会上报地理位置。
* 地理位置是一个event，会发送XML到你填写的开发者URL，然后触发事件推送气象信息。
* 在用户特定动作之后有类似于session的48小时的时间，公众号可以通过客服信息接口发送消息。

# 公众号消息会话类别

```公众号是以微信用户的一个联系人形式存在的，消息会话是公众号与用户交互的基础。目前公众号内主要有这样几类消息服务的类型，分别用于不同的场景。

① 群发消息 (Subscription Message)：公众号可以以一定频次（订阅号为每天1次，服务号为每月4次），向用户群发消息，包括文字消息、图文消息、图片、视频、语音等。

② 被动回复消息 (Passive Message)：在用户给公众号发消息后，微信服务器会将消息发到开发者预先在开发者中心设置的服务器地址（开发者需要进行消息真实性验证），公众号可以在5秒内做出回复，可以回复一个消息，也可以回复命令告诉微信服务器这条消息暂不回复。    被动回复消息可以设置加密（在公众平台官网的开发者中心处设置，设置后，按照消息加解密文档来进行处理。其他3种消息的调用因为是API调用而不是对请求的返回，所以不需要加解密）。

③ 客服消息 (Customer Service Message)：在用户给公众号发消息后的48小时内，公众号可以给用户发送不限数量的消息，主要用于客服场景。用户的行为会触发事件推送，某些事件推送是支持公众号据此发送客服消息的，详见微信推送消息与事件说明文档。

④ 模板消息 (Template Message)：在需要对用户发送服务通知（如刷卡提醒、服务预约成功通知等）时，公众号可以用特定内容模板，主动向用户发送消息。```

Source: https://www.cloudagiles.com/weixin-gongzhonghao-platform-develop-api/

# Key Takeaway
The technical side of the WeChat platform is constantly changing. It is very time consuming to maintain the same functionalities over time but they have the market.