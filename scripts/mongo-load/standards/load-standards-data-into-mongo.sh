#!/bin/bash

echo "Loading standards data into mongo..."
mongoimport -d bop-dev -c metacclselasciencetechnicalsubjects --type csv --file commonCoreELA.csv --headerline
mongoimport -d bop-dev -c metacclsmathematics --type csv --file standardsCommonCoreMath.csv --headerline
mongoimport -d bop-dev -c metangsscrosscuttingconcepts --type csv --file NGSSCrossCuttingConcepts.csv --headerline
mongoimport -d bop-dev -c metangssdisciplinarycoreideas --type csv --file dsciplinaryCoreIdeas.csv --headerline
mongoimport -d bop-dev -c metangssscienceengineeringpractices --type csv --file NGSSScienceAndEngineeringPractices.csv --headerline
mongoimport -d bop-dev -c metanycssunits --type csv --file NYCScopeSequenceUnits.csv --headerline
mongoimport -d bop-dev -c metanyssskeyideas --type csv --file NYSScienceStandardsKeyIdeas.csv --headerline
mongoimport -d bop-dev -c metanysssmajorunderstandings --type csv --file NYSScienceStandardsMajorUnderstandings.csv --headerline
mongoimport -d bop-dev -c metanysssmsts --type csv --file NYSScienceStandardsMST.csv --headerline
