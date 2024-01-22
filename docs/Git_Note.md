# Note on the use of Git and Github
The projectnext repo is hosted on GitHub. You need to be able to use git to work on projectnext, so learn git.

## Branches
The main branch is called main. We merge pull requests into main using github, i.e do not merge anything into main locally, you should always create a PR on github. We usually do not rebase, but rather merge our PRs.

The branch called prod (NOT YET IMPLEMENTED) should always contain the code currently in production. This branch has a CD pipeline to our server (NOT IMPLEMENTED) so be extremely careful when merging anything to prod. (VERSIONING ON PROD)

## On gitignore
As stated in [Getting Started](/Getting_Started.md) env's and the next-env.d.ts file are gitignored. This is for security reasons and the specifics of environment variables could be sensitive, if you belive that:

1. There is a variable that is specific to where projectnext is run, or
2. There is a variable with sensitive information.

you should probably considering making it an env. variable.
. You can find which environment variables are needed to run the project in default.env and next-env.default.d.ts

## Best practices
We use conventional commits, read about this [here](https://www.conventionalcommits.org/en/v1.0.0/), this gives commit messages a good structure and makes it easier to keep track of our history. The verbs: *chore, feat, refactor, fix* should also be used on branch names but with a / instead of a : used for commits.

Never commit anything directly to main or prod

## Workflows
Projectnext contains three workflows: all of which run when a PR on main is created or when something is pushed to main
1. linter
2. build
3. test [read more](/Testing.md) (NOT IMPLEMENTED)

A PR should never be merged if a test fails!