#!/bin/bash

if [ ! -e sites.csv ]
then
  echo "Error: couldn't not find sites.csv file"
  echo "You should run the load-data-into-mongo.sh from inside the scripts/mongo-load directory"
fi

echo "Loading data into mongo..."
mongoimport -d bop-dev -c sites --type csv --file sites.csv --headerline
mongoimport -d bop-dev -c metaweatherconditions --type csv --file metaWeatherConditions.csv --headerline
mongoimport -d bop-dev -c metawatercolors --type csv --file metaWaterColors.csv --headerline
mongoimport -d bop-dev -c metawaterflow --type csv --file metaWaterFlow.csv --headerline