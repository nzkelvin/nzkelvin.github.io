---
layout: post
comments: true
title:  "Building Your Own AI Agents"
date:   2025-01-24 08:00:00 +0800
categories: Technology
tags: [AI, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Building Your Own AI Agents"
    facebook: "Building Your Own AI Agents"
    linkedin: "Building Your Own AI Agents"
---
Large language models (LLMs) are powerful, but relying on cloud-based access has drawbacks: cost and privacy. Running LLMs locally gives you control, speed, data security, and the freedom to explore a wider range of models. This article records some of my learning journey.

### Hardware
To run AI models locally, you need sufficient computing power. While it is possible to run LLM models on CPUs. Both GPU processing power and graphic memory capacity are key factors for optimal speed.

Currently (Jan 20215), [Nvidia GPUs](https://www.nvidia.com/en-us/geforce/graphics-cards/compare/) have been dominating the market. The newer and the more memory, the better. 

In fact, RTX 4090 and newer models are so good that they are banned to be exported to China.

Nvidia GPUs are popular, but Apple's M1/M2/M3/M4 chips with integrated GPUs are a strong alternative. However, sometimes it is not available to environments inside docker containers.

If you are looking for a powerful AI laptop, [MSI Creator 16 AI Studio Laptop](https://marketplace.nvidia.com/en-us/consumer/gaming-laptops/msi-creator-16-ai-studio-laptop-intel-ultra-9-185h-16-uhd-miniled-display-nvidia-rtx-4090-64gb-ddr5-2tb-nvme-ssd-microsd-card-reader-win-11-pro-lunar-gray-a1vig-074us/) seems to be a good option.

### Hosting Options
For hosting AI models locally, several options are available:

* **[Anything LLM](https://anythingllm.com/):** Supports running LLM models locally and offers agents.
* **[LM Studio](https://lmstudio.ai/):** Provides an easier-to-use interface for running models locally.
* **[Ollama]():** Allows you to run models locally with a great degree of flexibility and its target audiance are developers or advanced users.
* **[n8n Self-hosted AI Start Kit](https://github.com/n8n-io/self-hosted-ai-starter-kit):** An open-source template that quickly sets up a local AI environment in docker containers.

