Push all uncommitted changes to the remote repository. Follow these steps exactly:

1. Run `git status` and `git diff` in parallel to see all changes.
2. Run `git log -10 --oneline` to understand recent commit style.
3. Analyse every changed and untracked file. Group related changes into one or more logical commits — don't lump everything into a single commit if the changes span unrelated concerns.
4. For each commit group:
   - Stage only the files that belong to that group.
   - Write a commit message that describes **what was built or fixed and why**, not just which files changed. Follow the style of recent commits in the log. End every commit message with:
     `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
   - Create the commit.
5. After all commits are made, run `git push` to push to the remote.
6. Confirm success with a short summary of what was committed and pushed.

Important rules:
- Never commit files that look like secrets (.env, credentials, private keys).
- Never use `git add -A` or `git add .` blindly — add files by name.
- Never force-push unless the user explicitly asks.
- If there is nothing to commit, say so clearly and do not push.
