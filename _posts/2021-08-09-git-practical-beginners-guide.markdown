---
layout: post
comments: true
title:  "Git Practical Beginner's Guide"
date:   2021-08-18 08:00:00 +0800
categories: Technology
tags: [Git, Github, Version Control, Repository, 101]
sharing:
    twitter: "Git Practical Beginner's Guide"
    facebook: "Git Practical Beginner's Guide"
    linkedin: "Git Practical Beginner's Guide"
---

# Branching Strategy/Model/Flow
GitFlow is a popular git flow strategy. It is a solid start point and can work with CI/CD flows well.

![image](https://datasift.github.io/gitflow/GitFlowHotfixBranch.png)

Source: https://datasift.github.io/gitflow/IntroducingGitFlow.html

# Theory
## Stages
Changes in a git repository can potentially in the following stages:

Indexed -> Staged -> Committed -> Pushed or Pulled to remote

## Concept: HEAD
HEAD means the current branch. To check where the HEAD is point, you can use the following command.

Unix style command
``` powershell
cat .git/HEAD
```

OR

Windows style command
``` powershell
type .git/HEAD
```

# Scenarios
## Get the latest code from an existing remote branch
The fetch command is for getting the latest of repo's branch structure. For example, if your colleagues have commited and pushed new branches.
``` powershell
git fetch
git switch "target-branch"
git pull
```

Even better, you can do the following.
``` powershell
git pull origin source-branch-name
git pull origin master #for example, do this on the target branch
```

However, I got burnt with the following command. Because it didn't prompt for conflicts, and left a lot of rubbish in my code base. 
``` powershell
git merge origin source-branch-name
```

## Create new branch
``` powershell
git switch -c "feature/[feature-name]"
```

The git checkout commend is retiring.
``` powershell
git checkout -b "feature/[feature-name]"
```

## Undo indexed changes
``` powershell
git clean
git clean -df #remove untracked directories and files.
```

## Undo staged changes
``` powershell
git checkout -- .
```

## Reset - Undo commited changes with reset
The following command set is for undo the latest commit and it will also keep the change at your local repo unstaged.
``` powershell
git add .
git commit -m "yolo"
git push 
git reset --soft HEAD~1
git commit -m "maybe not"
git push 
```

## Rebase
The following command will go to the head of the origin/main branch. Then apply all commits from the "feature/yolo" branch on the top.
``` powershell
git switch feature/yolo
git rebase origin/main
```

## WorkTree
This is a very useful command. It allows you to have multiple branches available locally in parallel. So you can multitask or compare code in different branches.

git workfree add [local file path] [git branch name]

``` powershell
git worktree add "../yolo" feature/yolo
git worktree remove feature/yolo
```

## Rename your branch
``` powershell
git checkout <old_name>
git branch -m <new_name>
git push origin -u <new_name>
git push origin --delete <old_name>
```
### Reference(s)
https://linuxize.com/post/how-to-rename-local-and-remote-git-branch/

## Revert a commit already pushed to a remote repository
"People generally avoid history rewiriting, for a good reason: it will fundamentally diverge your repository from anyone who cloned or forked it. People cannot just pull your rewritten history as usual. If they have local changes, they have to do some work to get in sync again; work which requires a bit more knowledge on how Git works to do it properly."

### Reference(s)
https://christoph.ruegg.name/blog/git-howto-revert-a-commit-already-pushed-to-a-remote-reposit.html

## tag
Deployment
https://stackoverflow.com/questions/18216991/create-a-tag-in-a-github-repository

## stash
### Scenarios
You are working on a feature branch and your team lead asked your to fix a bug with urgency. So you need to stash you current work and switch context.

``` powershell
# your are working on new features on branch A
# Save WIP changes
git stash
git swith bugfixes/branch-b
# fix bugs in the branch b
git stash pop
```
### Scenario: Stash your work with meaningful comment.
I recommend stage this way over the default git stash
``` powershell
git stash save "remove semi-colon from schema"
git stash list
git stash pop stash@{2}
```

### Other useful git stash parameters
``` powershell
git stash save --keep-index #All changes already added to the index (staged) are left intact
git stash save --keep-index --include-untracked
git stash --all #stash untracked files and ignored files.
git stash drop
```

### Reference(s)
https://opensource.com/article/21/4/git-stash

## switch vs checkout
git switch "branch-name" = git checkout "branch-name"

git restore "path-to-a-file" = git checkout "path-to-a-file"

### git switch command parameters
``` powershell
    -c, --create <branch> #create and switch to a new branch
    -m, --merge #perform a 3-way merge with the new branch
```

## push
The following three commands are doing the same thing. the "-u" parameter name stands for upstream.
``` powershell
git push -u origin feature/yolo
```
``` powershell
git push -u origin
```
``` powershell
git push
```

## remote prune
### Scenario: remove the local branches that are not on the remote any more.
``` powershell
git branch -vv #Check local remote branches mapping
git branch -r #List all remote branches
git remote prune origin
```

### Scenario: delete all local branches that are already merged into master
``` powershell
git branch --merged main | grep -v '^[ *]*main$' | xargs git branch -d
```

## Local Git Repository Configuration
### Why Configure user.name and user.email?
These settings are crucial for identifying who contributes to a Git repository's commits. This is particularly important in open-source projects where proper attribution is essential. While it's technically possible to fake this information, technical measures (like commit signing) and legal frameworks exist to protect authenticity.

## Repository-Specific Configuration
If you work on multiple projects across platforms, each with different aliases or email addresses, configuring these settings per repository is essential. This ensures that each commit is correctly attributed to the right identity.

To configure user.name and user.email for a specific repository, navigate to the repository's root directory and execute:
```powershell
cd /path/to/your/repository
git config user.name "Your Name"
git config user.email "your.email@example.com"
```
Replace "Your Name" and "your.email@example.com" with your actual name and email address for that repository.

### How to configure the settings globally
To set a default name and email for all repositories on your system, use the following commands:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Reference(s)
https://stackoverflow.com/questions/13064613/how-to-prune-local-tracking-branches-that-do-not-exist-on-remote-anymore

# Tools 
## Fork
[A light weight tool](https://git-fork.com/) and great for visualization.

## Pretty Prompt
### How to setup
Please check out [this brilliant article](https://www.hanselman.com/blog/how-to-make-a-pretty-prompt-in-windows-terminal-with-powerline-nerd-fonts-cascadia-code-wsl-and-ohmyposh) from almighty Scott Hanselman.

### Prompt status abbreviation explained
#### The local branch is behind
![image](../images/2021-08-09-git-practical-beginners-guide\local-branch-behind.png)

![image](../images/2021-08-09-git-practical-beginners-guide\local-branch-behind2.png)

#### The local branch is ahead
![image](../images/2021-08-09-git-practical-beginners-guide\local-branch-ahead.png)

#### The merge conflict
![image](../images/2021-08-09-git-practical-beginners-guide/merge-conflict.png)

#### Committed and pushed
![image](../images/2021-08-09-git-practical-beginners-guide/commited-versus-pushed.png)

## PoshGit
I couldn't say better than Phil Haack. So here is a link to [his PoshGit blog post](http://haacked.com/archive/2011/12/13/better-git-with-powershell.aspx/).

# References
## Sources
What is Git HEAD?
https://stackoverflow.com/questions/10228760/how-do-i-fix-a-git-detached-head
https://stackoverflow.com/questions/2304087/what-is-head-in-git

How to check current HEAD? 
https://stackoverflow.com/questions/25879039/cat-git-head-command-in-windows

What is the difference between soft and hard reset?
https://stackoverflow.com/questions/3528245/whats-the-difference-between-git-reset-mixed-soft-and-hard/3528483#3528483
