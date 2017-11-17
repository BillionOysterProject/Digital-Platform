
## Contribute to an important restoration and education effort in NYC!
The [Billion Oyster Project](https://billionoysterproject.org/) is an ecosystem restoration and education project designed to restore one billion live oysters to New York Harbor by 2035 while educating all one million of NYC's public school students.  But if we're going to restore one billion oysters to New York Harbor, we need lots of New Yorkers' help with all the work that goes into restoration, including software development!  Environmental restoration includes activities like data analysis and scientific communications, and the [BOP Digital Platform](https://platform.bop.nyc/) is a key tool for these aspects of our work.  

One thing that sets Billion Oyster Project apart from other environmental organizations is that we are equal parts restoration AND education.  So we believe that open source software projects are the perfect opportunity for people of a wide range of ages and ability levels to use their technical skills for good while learning new skills and building community.  Whether you're a developer, DBA, UX designer, QA tester, or just a passionate user, we'd love for you to join us as a contributor!  

__Take a look through the information below to get started!__  

* __Quick Guide.__ Check out the [BOP Digital Platform Quick Guide](https://www.arcgis.com/apps/MapJournal/index.html?appid=64589a40aed54de69ea6ffab01a0868f).  This is a doc you can quickly scroll through to get a sense of the platform's core features, and it includes links to all the help documentation in our [wiki](https://github.com/BillionOysterProject/docs/wiki/Digital-Platform-User-Guide-Table-of-Contents).

* __Sign-up.__ [Sign up for an account on the BOP Digital Platform](https://platform.bop.nyc/authentication/signup) if you'd like to get a sense of the user experience- make sure to choose the "team lead" role.  

* __Code of Conduct.__ Read our [code of conduct](https://github.com/BillionOysterProject/Digital-Platform/blob/1f7e8c43b25aa64a3784a99312b1d456def1a012/CODE_OF_CONDUCT.md).  Since our project engages community members of all abilities, especially NYC school students, it's crucial that everyone in the Digital Platform community is kind, assumes a good faith effort/best intentions on the part of other participants, and goes out of their way to be welcoming to people who are new to coding and technology.  (One negative social interaction can be really discouraging for students/people who are just getting involved with open source, so we ask you to really go out of your way to be patient and friendly!)  

* __API and data model documentation.__ We want to more fully flesh out our API documentation, but this is our current [API and data model documentation](https://platform.bop.nyc/apiDocs/).  The front end makes extensive use of the API.

* __MEAN.JS.__ The platform was originally built by contractors based off the [MEAN.JS stack](http://meanjs.org/) (MongoDB, Express, Angular, Node.js).  They forked it from the [MEAN.JS project in Github](https://github.com/meanjs/mean) in February 2016.  We've reviewed every MEAN.JS commit since 2/2016, and there are two features we're likely to implement (sign-on with email address, and forgot password with email address).  Other than that, we're not expecting to add anything newer from the project, but if you know of a cool MEAN.JS implementation let us know!

* __Github issues.__ Check out our list of [Github issues](https://github.com/BillionOysterProject/Digital-Platform/issues).  At the moment, we're using Github issues to showcase the project's most pressing software development requests.  (We have a much larger internal backlog, but the Github issues are our way of highlighting issues that we've learend are important to our community members through site feedback and user testing.)

* __Open an issue.__ If you think there's something interesting you could do, or a bug you could fix, and it's not an existing issue in Github, [open up an issue](https://github.com/BillionOysterProject/Digital-Platform/issues).  We don't have a standard issue format or standard pull request format yet, but we'll post it as soon as we do!

Please let us know if you have any questions or ideas you'd like to share!  You can get in touch with Heather Flanagan, the BOP Digital Platform's product owner, at <hflanagan@nyharbor.org>.




## Creating an Issue

Before you create a new Issue:
* Check the [Issues](https://github.com/meanjs/mean/issues) on Github to ensure one doesn't already exist.
* Clearly describe the issue, including the steps to reproduce the issue.
* If it's a new feature, enhancement, or restructure, explain your reasoning on why you think it should be added, as well as a particular use case.

## Making Changes

* Create a topic branch from the master branch.
* Check for unnecessary whitespace / changes with `git diff --check` before committing.
	* Also check that your code is formatted properly with spaces (hint: Use [.editorconfig](http://editorconfig.org/))
* Keep git commit messages clear and appropriate
	* If possible, please "squash" your commits to as few commits as possible/reasonable such as one commit for implementation, one for tests, and one for documentation before finally squashing to one commit when getting the LGTM from a collaborator.
  * Follow the commit message guidelines below.
* Make Sure you have added any tests necessary to test your code.
	* Run __all__ the tests to ensure nothing else was accidently broken.
	* Don't rely on the existing tests to see if you've broken code elsewhere; test the changes you made in a browser too!
* Update the Documentation to go along with any changes in functionality / improvements in a separate pull request against the gh-pages branch.

## Commit Message Guidelines
```
Header
Blank Line
Body
Blank Line
Footer

The header should look like:
<type>(<scope>): <subject>

The body should have any necessary detailed info about the commit:
An example, references as to where this idea came from, etc.

The footer should have all the issues tagged:
Fixes #123, Fixes #456

So a commit should like like:
feat(users): Add new Yahoo authentication

Yahoo authentication idea proposed by @codydaig
Example implementation in file.js

Fixes #82
```

* Types: 
  * feat - Features, Enhancements, and overall Improvements
  * fix - Fixes, Bugs, HotFixs, etc...
  * doc - Changes to the Documentation and doesn't actually touch any code.
* Scope:
  * The scope should be where the change took place.
  * Examples: users, core, config, articles
* Subject:
  * The subject line should be clear and concise as to what is being accomplished in the commit.
* General Rules:
  * No Line in the Commit message can be longer than 80 characters.
* Refrence: [Angular Conventions](https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md)


## Submitting the Pull Request

* Push your changes to your topic branch on your fork of the repo.
* Submit a pull request from your topic branch to the master branch on the MEAN.JS repository.
* Be sure to tag any issues your pull request is taking care of / contributing to.
	* By adding "Closes #xyz" to a commit message will auto close the issue once the pull request is merged in.
* Small changes are usually accepted and merged in within a week (provided that 2 collaborators give the okay)
* Larger changes usually spark further discussion and possible changes prior to being merged in.

## Documentation 

The code for the documentation and the website are located in the meanjs/mean repo on the gh-pages branch. The website is hosted by github pages and generated using jekyll. See the README in the gh-pages branch for more information on how to get your dev enviorment set-up.


