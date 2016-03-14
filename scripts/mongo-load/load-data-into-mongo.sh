#!/bin/bash

if [ ! -e data/sites.jsony]
then
  echo "Error: couldn't not find data/sites.json file"
  echo "You should run the load-data-into-mongo.sh from inside the scripts/mongo-load directory"
fi

echo "Loading data into mongo..."
mongoimport -d bop-dev -c sites --type json --file data/sites.json
mongoimport -d bop-dev -c metaweatherconditions --type json --file data/metaWeatherConditions.json
mongoimport -d bop-dev -c metawatercolors --type json --file data/metaWaterColors.json
mongoimport -d bop-dev -c metawaterflows --type json --file data/metaWaterFlows.json
mongoimport -d bop-dev -c metashorelinetypes --type json --file data/metaShorelineTypes.json
