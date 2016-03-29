#!/bin/bash

echo "Loading standards data into mongo..."
mongoimport -d bop-dev -c commoncoreela --type csv --file commonCoreELA.csv --headerline
mongoimport -d bop-dev -c dsciplinaryCoreIdeas --type csv --file dsciplinaryCoreIdeas.csv --headerline
mongoimport -d bop-dev -c ngsscrosscuttingconcepts --type csv --file NGSSCrossCuttingConcepts.csv --headerline
mongoimport -d bop-dev -c ngssscienceandengineeringpractices --type csv --file NGSSScienceAndEngineeringPractices.csv --headerline
mongoimport -d bop-dev -c nycscopesequenceunits --type csv --file NYCScopeSequenceUnits.csv --headerline
mongoimport -d bop-dev -c nyssciencestandardskeyideas --type csv --file NYSScienceStandardsKeyIdeas.csv --headerline
mongoimport -d bop-dev -c nyssciencestandardsmajorunderstandings --type csv --file NYSScienceStandardsMajorUnderstandings.csv --headerline
mongoimport -d bop-dev -c nyssciencestandardsmst --type csv --file NYSScienceStandardsMST.csv --headerline
mongoimport -d bop-dev -c standardscommoncoremath --type csv --file standardsCommonCoreMath.csv --headerline
