---
layout: post
comments: true
title:  "OCR ID Card Detection in a Dynamics 365 Native Mobile App"
date:   2019-12-17 08:00:00 +0800
categories: Technology
tags: [Mobile, Microsoft, Dynamics, OCR, Ali, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "OCR ID Card Detection in a Dynamics 365 Native Mobile App"
    facebook: "OCR ID Card Detection in a Dynamics 365 Native Mobile App"
    linkedin: "OCR ID Card Detection in a Dynamics 365 Native Mobile App"
---

# The Final Results
Mobile devices are born with cameras, microphones and other sensors. With a 'Dynamics 365 for phones' app in your palm, will it be cool if you can scan ID cards with a camera of your phone? This is exactly what I did. The user persona is for workers on the ground and constantly on the go.

Pictures worths thousands of words.

![image](../images/2019-12-17-ocr-id-card-detection-in-d365-native-app/OcrStep1.jpg)

![image](../images/2019-12-17-ocr-id-card-detection-in-d365-native-app/OcrStep2.jpg)

# The Design
![image](../images/2019-12-17-ocr-id-card-detection-in-d365-native-app/OcrDesign.png)

# Backend
Calling a backend web API with a security token via client code should be forbidden because letting someone to see your security tokens is just too unsecure. So, I opt for a Dynamics 365 action as the middle 'man'.

# Aliyun ID Card OCR endpoints
'Yun' means cloud in Chinese. 

So Alibaba Cloud has off-the-shelf web APIs for OCR processing Chinese nation ID card. Here is a 

The [Aliyun ID Card OCR endpoint documentation](https://market.aliyun.com/products/57124001/cmapi010401.html?spm=5176.mktshop1334330.1.2.3f0664e1rkxaq2#sku=yuncode440100000) can be better. At least, the error codes definition section is empty. After poking around, I found [the error code documentation is on another page](https://help.aliyun.com/document_detail/95605.html).


# Frontend
## Xrm.Device.captureImage
 The quality of a photo upload will affect the accuracy of a result directly. The key properties of a photo are size, rotation, angle, focus, lighting. For example, I had much better OCR results after increase the image size by 10%.  

``` javascript
// The imageOptions settings below worked really well.
var imageOptions = {
    allowEdit: true,
    height: 275,
    width: 440,
    preferFrontCamera: true,
    quality: 100
};

Xrm.Device.captureImage(imageOptions).then()

```

## What is missing
### Show progressing
The ID card OCR process takes a few seconds to complete. So, I wanted a UI control to show progress while waiting. I would be happy with a spinning wheel or a message which can block the main form. But nothing works to that effect in the native app. Let's not discussing the choice of the control just yet. I found the following client API functions don't work in the native app. 

* Xrm.Utility.showProgressIndicator
* Xrm.Utility.closeProgressIndicator
* formContext.ui.setFormNotification
* formContext.ui.clearFormNotification


PCF probably is a better option for developing something more intuitive but PCF controls are only supposed work in Dynamics 365 online environments. In my case, my client is on a on-premise Dynamics 365 with IFD enabled. So, I am still waiting Microsoft to allow us to deploy PCF controls to on-premise Dynamics 365 organizations.

## Mobile debugging
### Remote Debugging
You can only remote debugging with the Windows 10 version of the 'Dynamics 365 for tablets' app.

Steps: 
* Sprinkle some 'debugger' keywords as break points in your JS code.  
* Open your frondend JS code in Visual Studio.
* Open the Windows 10 version of the 'Dynamics 365 for tablets' app.
* Debug attach your VS to the 'WWAHost.exe' process.
* Go through your reproducable steps towards the bug.

My colleague also [documented the steps in Chinese](https://blog.csdn.net/vic0228/article/details/103496255).

### It Only Fails in Andriod!
What is a worst bug? I definitely feel like pulling my hair out when something fail silently and there is no way to debug.

Initially, I couldn't get the Aliyun endpoint to respond on the Android version of the app. The same functionality worked beautifully on a Windows 10 version of App (Dynamics 365 for tablet). The failure on Android was quiet and I just couldn't find a way to remote debug.

### Inconsistancy between Android and Windows 10 native apps
If you want make a XMLHttpRequest call from Dynamics 365 frontend JavaScript. The Windows 10 native app will quite happily call a HTTP URL. However, the Android native app will accept nothing less than an HTTPS URL, and it will fail SILENTLY on an HTTP URL!!!

### Remote Debug the Dynamics 365 Native App or Trying
The 'Dynamics 365 for Operations' app has remote debugging capability. You can have [the remote debugging super power](https://www.linkedin.com/pulse/dynamics-365-unified-operations-mobile-app-debugging-yadav/) by downloading and installing a special version of the app. You cannot do so from standard app Stores. Downloading Apk files are the way to go. 

Unfortunately, the 'Dynamics 365 for phones' app doesn't have the special version. Please let me know if you have a way to remote debug the Android app directly. Thanks in advance!



## Other Cool Frontend UX functionalities the D365 Native App supports
* captureAudio
* captureImage	
* captureVideo
* getBarcodeValue - I don't know if it can also scan QR codes. I will report back.
* getCurrentPosition
* pickFile	