---
layout: post
comments: true
title:  "How to manage multiple GitHub accounts on a single machine"
date:   2023-06-08 08:00:00 +0800
categories: Technology
tags: [AI, Copilot, Github, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "How to manage multiple GitHub accounts on a single machine"
    facebook: "How to manage multiple GitHub accounts on a single machine"
    linkedin: "How to manage multiple GitHub accounts on a single machine"
---

## How to manage multiple GitHub accounts on a single machine
My GitHub Copilot operates on a different account than the repository I'm pushing to. How can I seamlessly integrate two GitHub accounts on a single machine?

## Using Personal Access Tokens (PATs):

1. **Generate a PAT for the second account**:
   - Go to your GitHub account (the one you want to push code to).
   - Navigate to `Settings` > `Developer settings` > `Personal access tokens`.
   - Click on `Generate new token`.
   - Select the scopes you need for your project (usually `repo` is enough if you just need to push or pull code).
   - Click on `Generate token`.
   - **Copy the token** and save it somewhere secure. This is the only time you'll see it.

2. **Use the PAT in your repository**:
   - Go to your project directory.
   - When you need to push or pull from the repo, use the URL format: `https://<TOKEN>@github.com/username/repo.git`. For example:
     ```bash
     git clone https://<TOKEN>@github.com/nzkelvin/nzkelvin.github.io.git
     ```

This will allow you to interact with the repo using the token, which is associated with the correct account. You can also set this URL as the remote URL for your repository using `git remote set-url`.

## Using SSH Keys:

If you prefer using SSH keys instead of HTTPS and PATs, you can add multiple SSH keys to your machine, one for each GitHub account.

1. **Generate SSH Key for the second account**:
   - If you haven't generated an SSH key for this account yet:
     ```bash
     ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
     ```
   - When prompted, give it a different name from your default key, for example, `id_rsa_nzkelvin`.

2. **Add the SSH key to the ssh-agent**:
   ```bash
   ssh-add ~/.ssh/id_rsa_nzkelvin
   ```

3. **Add the SSH key to your second GitHub account**:
   - Copy the content of the `id_rsa_nzkelvin.pub` file.
   - Go to GitHub, navigate to `Settings` > `SSH and GPG keys`.
   - Click `New SSH key`, paste your key, and save.

4. **Configure your Git repository to use the correct SSH key**:
   - Inside your repository, create or modify the `.ssh/config` file to specify which key to use for which domain. Here's an example:
     ```
     # Default GitHub account
     Host github.com
         HostName github.com
         User git
         IdentityFile ~/.ssh/id_rsa

     # Second GitHub account
     Host github-nzkelvin
         HostName github.com
         User git
         IdentityFile ~/.ssh/id_rsa_nzkelvin
     ```

   - Change the remote URL of your repository to use the new host:
     ```bash
     git remote set-url origin git@github-nzkelvin:nzkelvin/nzkelvin.github.io.git
     ```

Now, when you interact with the repository, it will use the correct SSH key for the `nzkelvin` account.

Both of these methods allow you to keep using GitHub Copilot with one account and push/pull code with another account. Choose the one that's more convenient for you.

### Check git push url
```PowerShell
git config --get remote.origin.url

git remote set-url origin https://<TOKEN>@github.com/nzkelvin/nzkelvin.github.io.git
```

