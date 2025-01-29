---
layout: post
comments: true
title:  "Portal Dynamics Forms"
date:   2024-10-13 08:00:00 +0800
categories: Technology
tags: [TypeScript, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Portal Dynamics Forms"
    facebook: "Portal Dynamics Forms"
    linkedin: "Portal Dynamics Forms"
---

## Scenario
Say you have an application portal form, you want it to be read-only after submission but editable in the draft status

## Solution
Multiple web forms and use liquid template to switch forms base on status. If you wanna reuse the liquid code, please copy the content between {% raw %} and {% endraw %}.

```liquid
{% raw %}

{% assign entity_logical_name = 'case' %}
{% assign record_id = request.params['id'] %}

{% fetchxml record %}
<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
  <entity name="{{ entity_logical_name }}">
    <attribute name="statuscode" /> 
    <filter type="and">
      <condition attribute="caseid" operator="eq" value="{{ record_id }}" /> 
    </filter>
  </entity>
</fetch>
{% endfetchxml %}

{% assign status_code = record.results.entities[0].statuscode.value %}

{% if status_code == '1' %} 
  {% entityform name: 'Web Basic Form - Case' %} 
{% else %} 
  {% entityform name: 'Web Basic Form - Case Read-only' %} 
{% endif %}

{% endraw %}
```
