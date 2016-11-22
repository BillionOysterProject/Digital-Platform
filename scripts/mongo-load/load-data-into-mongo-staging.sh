#!/bin/bash

if [ ! -e sites.json ]
then
  echo "Error: couldn't not find data/sites.json file"
  echo "You should run the load-data-into-mongo.sh from inside the scripts/mongo-load directory"
fi

echo "Loading data into mongo..."

#mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c sites --type json --file sites.json --drop

mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metaweatherconditions <username/password> --type json --file metaWeatherConditions.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metawatercolors <username/password> --type json --file metaWaterColors.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metawaterflows <username/password> --type json --file metaWaterFlows.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metashorelinetypes <username/password> --type json --file metaShorelineTypes.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metabioaccumulations <username/password> --type json --file metaBioaccumulations.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metabodiesofwater <username/password> --type json --file metaBodiesOfWater.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metaboroughscounties <username/password> --type json --file metaBoroughsCounties.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metagarbageextents <username/password> --type json --file metaGarbageExtents.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metawinddirections <username/password> --type json --file metaWindDirections.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metatruefalses <username/password> --type json --file metaTrueFalses.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metasubjectareas <username/password> --type json --file metaSubjectAreas.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metaeventtypes <username/password> --type json --file metaEventTypes.json --drop

mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metawatertemperaturemethods <username/password> --type json --file metaWaterTemperatureMethods.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metadissolvedoxygenmethods <username/password> --type json --file metaDissolvedOxygenMethods.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metasalinitymethods <username/password> --type json --file metaSalinityMethods.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metaphmethods <username/password> --type json --file metaPhMethods.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metaturbiditymethods <username/password> --type json --file metaTurbidityMethods.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metaammoniamethods <username/password> --type json --file metaAmmoniaMethods.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metanitratemethods <username/password> --type json --file metaNitrateMethods.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metawatertemperatureunits <username/password> --type json --file metaWaterTemperatureUnits.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metadissolvedoxygenunits <username/password> --type json --file metaDissolvedOxygenUnits.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metasalinityunits <username/password> --type json --file metaSalinityUnits.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metaphunits <username/password> --type json --file metaPhUnits.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metaturbidityunits <username/password> --type json --file metaTurbidityUnits.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metaammoniaunits <username/password> --type json --file metaAmmoniaUnits.json --drop
mongoimport -h ds011419.mlab.com:11419 -d bop-staging -c metanitrateunits <username/password> --type json --file metaNitrateUnits.json --drop

#mongoimport -d bop-dev -c metaorganismcategories --type json --file metaOrganismCategories.json --drop
#mongoimport -d bop-dev -c mobileorganisms --type json --file mobileOrganisms.json --drop
#mongoimport -d bop-dev -c sessileorganisms --type json --file sessileOrganisms.json --drop
#mongoimport -d bop-dev -c metasubjectareas --type json --file metaSubjectAreas.json --drop
