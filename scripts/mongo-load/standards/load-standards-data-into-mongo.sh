#!/bin/bash

echo "Loading standards data into mongo..."
mongoimport -d bop-dev -c metacclsmathematics --type json --file metaCclsMathematics.json --drop
mongoimport -d bop-dev -c metacclselasciencetechnicalsubjects --type json --file metaEclsElaScienceTechnicalSubjects.json --drop
mongoimport -d bop-dev -c metangsscrosscuttingconcepts --type json --file metaNgssCrossCuttingConcepts.json --drop
mongoimport -d bop-dev -c metangssdisciplinarycoreideas --type json --file metaNgssDisciplinaryCoreIdeas.json --drop
mongoimport -d bop-dev -c metangssscienceengineeringpractices --type json --file metaNgssScienceEngineeringPractices.json --drop
mongoimport -d bop-dev -c metanycssunits --type json --file metaNycssUnits.json --drop
mongoimport -d bop-dev -c metanyssskeyideas --type json --file metaNysssKeyIdeas.json --drop
mongoimport -d bop-dev -c metanysssmajorunderstandings --type json --file metaNysssMajorUnderstandings.json --drop
mongoimport -d bop-dev -c metanysssmsts --type json --file metaNysssMsts.json --drop
