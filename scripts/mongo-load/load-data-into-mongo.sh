#!/bin/bash

if [ ! -e data/sites.jsony]
then
  echo "Error: couldn't not find data/sites.json file"
  echo "You should run the load-data-into-mongo.sh from inside the scripts/mongo-load directory"
fi

echo "Loading data into mongo..."
mongoimport -d bop-dev -c sites --type csv --file sites.csv --headerline --drop
mongoimport -d bop-dev -c metaweatherconditions --type csv --file metaWeatherConditions.csv --headerline --drop
mongoimport -d bop-dev -c metawatercolors --type csv --file metaWaterColors.csv --headerline --drop
mongoimport -d bop-dev -c metawaterflows --type csv --file metaWaterFlows.csv --headerline --drop
mongoimport -d bop-dev -c metashorelinetypes --type csv --file metaShorelineTypes.csv --headerline --drop
mongoimport -d bop-dev -c metabioaccumulations --type csv --file metaBioaccumulations.csv --headerline --drop
