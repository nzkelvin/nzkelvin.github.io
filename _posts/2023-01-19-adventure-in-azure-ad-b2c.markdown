---
layout: post
comments: true
title:  "Adventures in Azure AD B2C: A Tale of User Flows, Custom Policies, and WeChat Integration"
date:   2023-01-19 08:00:00 +0800
categories: Technology
tags: [Azure, Azure AD B2C, OAuth, OpenID, Power Pages, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Adventures in Azure AD B2C: A Tale of User Flows, Custom Policies, and WeChat Integration"
    facebook: "Adventures in Azure AD B2C: A Tale of User Flows, Custom Policies, and WeChat Integration"
    linkedin: "Adventures in Azure AD B2C: A Tale of User Flows, Custom Policies, and WeChat Integration"
---

Once upon a time in the fantastical land of Azure, there was a magical kingdom called Azure AD B2C. This kingdom was known for its user-friendly authentication and powerful customization abilities. The citizens of the kingdom were developers from all over the world, working together to create seamless identity experiences.

In this enchanted land, "User Flows" were like pre-packaged spell books filled with incantations for standard authentication scenarios. Wizards (developers) could simply open a book (select a flow) and cast a spell (implement a scenario) to conjure up a marvelous authentication experience. But the wizards soon realized that they needed more powerful spells for unique situations.

Thus, they began to explore the arcane art of "Custom Policies." Custom policies were like crafting a personalized spell book, giving wizards more control over their incantations. These custom spells were written in three mysterious scrolls: TrustFrameworkBase.xml, TrustFrameworkExtensions.xml, and a Relying Party Policy. The TrustFrameworkBase.xml held the foundations of magic, while TrustFrameworkExtensions.xml contained powerful extensions and modifications. The Relying Party Policy was the key to summoning these forces into the real world.

One day, a group of daring wizards decided to embark on a thrilling quest to integrate the legendary WeChat MFA Provider into their kingdom. These trailblazers began by venturing to the WeChat Open Platform, where they registered their application and received a sacred AppID and AppSecret. Armed with these tokens, they modified their TrustFrameworkExtensions.xml scroll, adding the mystical power of WeChat to their custom policies.

Meanwhile, another group of skilled wizards was exploring the realm of Power Apps Portal, seeking to harness its capabilities in harmony with Azure AD B2C. These developers discovered that by carefully mapping claims and modifying JWT token compatibility settings, they could achieve a seamless integration between the two worlds.

The kingdom was buzzing with excitement, as wizards everywhere experimented with different authentication protocols. They debated the merits of OAuth 2.0, OpenID Connect, and SAML 2.0, each with its own set of enchantments and limitations. It was a golden age of magical innovation, with many lively discussions and a few friendly duels.

As the wizards delved deeper into the secrets of Azure AD B2C, they learned to harness the power of tokens and claims. They became masters of transforming JWT tokens, manipulating issuer (iss) claims, and bending the trust framework policy (tfp) claims to their will. These newfound skills enabled them to create even more remarkable identity experiences.

And so, the wizards of Azure AD B2C continued their journey through the realm of authentication, integration, and customization. Along the way, they encountered challenges, but their resourcefulness and camaraderie prevailed. As they cast spells and crafted new enchantments, they brought laughter and joy to the kingdom, making the world of Azure AD B2C a truly magical place.
