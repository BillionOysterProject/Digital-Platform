# Billion Oyster Project Digital Platform

The <a href="https://billionoysterproject.org/">Billion Oyster Project</a> is an ecosystem restoration and education project designed to restore one billion live oysters to New York Harbor. Our BOP Schools and Community Science program seeks to increase the skills, content knowledge, and confidence of underrepresented groups in STEM fields through hands on, authentic restoration and research activities. Schools, organizations, businesses, and community scientists each get a waterfront <a href="https://billionoysterproject.org/restoration-station/">Oyster Research Station</a>, a small waterfront cage filled with oysters, which they use to collect data on oyster growth and mortality, local biodiversity, and water quality. The [BOP Digital Platform](https://platform.bop.nyc/) is the online dashboard for our program. Through the Platform, students and teachers enter and publish data, develop field research projects, and create the STEM curriculum that links keystone species restoration in New York Harbor to teaching and learning in New York City Schools.  

For a quick scroll-through of the platform's features, check out the [BOP Digital Platform Quick Guide](https://www.arcgis.com/apps/MapJournal/index.html?appid=64589a40aed54de69ea6ffab01a0868f). For more detailed documentation, the BOP Digital Platform User Guide lives [here](https://github.com/BillionOysterProject/docs/wiki/Digital-Platform-User-Guide-Table-of-Contents).

In light of our goals, we're strongly committed to making the Billion Oyster Project Digital Platform an inclusive, welcoming open source community.  Before contributing to the project, please read our [Code of Conduct](https://github.com/BillionOysterProject/docs/blob/master/CODE_OF_CONDUCT.md) and our [Contributing Guide](https://github.com/BillionOysterProject/Digital-Platform/blob/master/CONTRIBUTING.md).

This project is based off the <a href="http://meanjs.org/">MEAN.js stack</a>

### Before starting, have the following installed on your system
* *Node.js* -  <a href="http://nodejs.org/download/">Download</a> and Install Node.js or use the packages within brew or macports.
* *MongoDB* - Follow the tutorial here - <a href="https://www.mongodb.com/download-center?jmp=nav#community">Install mongoDB</a>
* *git* - Get git <a href="http://git-scm.com/download/mac">from here</a>.
* *java* - <a href="https://www.java.com/en/download/">Download</a> and install or use the package within brew (brew cask install java)
* *ruby* - <a href="https://www.ruby-lang.org/en/downloads/">Download</a> and install or use the package within brew (brew install ruby)
* *sass* - gem install sass

* using npm version - 3.6.0
* using node version - 5.6.0

## Getting Started
Install globals and build.
```
# You can use nvm to install any Node.js (or io.js) version you require.
nvm install 4.3.0

npm install -g grunt-cli

npm install -g gulp

npm install -g bower

npm install

bower install
```

To generate a new scaffold
```
npm install -g yo

npm install -g generator-meanjs

```

To load data
```
cd scripts/mongo-load

./load-data-into-mongo.sh
```


Once you have cloned down this project, run:
```
cd Digital-Platform

npm install

#make sure mongo is running

grunt

open the browser to -  http://localhost:8081

```

To run the Protractor tests:
```
npm install -g protractor

#in one terminal

webdriver-manager update

webdriver-manager start #this is the only command you'll need to start the server once it's installed

#in a separate terminal
grunt test:e2e
```
