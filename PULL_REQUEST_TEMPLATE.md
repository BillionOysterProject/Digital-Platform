## Making Changes

* Create a topic branch from the master branch.
* Check for unnecessary whitespace / changes with `git diff --check` before committing.
* Also check that your code is formatted properly with spaces (hint: Use [.editorconfig](http://editorconfig.org/))
* Keep git commit messages clear and appropriate.
* Follow the commit message guidelines below.
* Make sure you have added any tests necessary to test your code.
	* Run __all__ the tests to ensure nothing else was accidently broken.
	* Don't rely on the existing tests to see if you've broken code elsewhere; test the changes you made in a browser too!


## Commit Message Guidelines
```
Header
Blank Line
Body
Blank Line
BOP Digital Platform username
Footer

The header should look like this:
<type>(<scope>): <subject>

The body should have any necessary detailed info about the commit:
An example, references as to where this idea came from, etc.

The footer should have all the issues tagged:
Fixes #123, Fixes #456

So a commit should look like:
feat(Expeditions): Add new checkbox to Protocol 2: Oyster Measurements form.

This feature adds a checkbox to indicate wild oyster recruitment at the site.  Idea proposed by @haflanagan

UN: bop-admin

Fixes #82
```

* Types: 
  * feat - features, enhancements, and overall improvements
  * fix - fixes, bugs, HotFixs, etc...
  * doc - changes to the documentation that don't actually touch any code.
* Scope:
  * The scope should be where the change took place.
  * Examples: Expeditions, Data, Curriculum, Events
* Subject:
  * The subject line should be clear and concise as to what is being accomplished in the commit.
* General Rules:
  * No line in the commit message can be longer than 80 characters.


## Submitting the Pull Request

* Push your changes to your topic branch on your fork of the repo.
* Submit a pull request from your topic branch to the master branch on the Digital-Platform repository.
* Be sure to tag any issues your pull request is taking care of / contributing to.
* Someone from BOP will get in touch within a week to discuss your pull request!
