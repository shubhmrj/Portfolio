#!/bin/bash

# Remove the large file from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch images/bg/CursorUserSetup-x64-1.0.0.exe" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up the backup refs
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d

# Perform aggressive garbage collection
git reflog expire --expire=now --all
git gc --prune=now --aggressive
