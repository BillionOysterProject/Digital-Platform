#!/bin/bash

if [ ! -e sites.json ]
then
  echo "Error: couldn't not find data/sites.json file"
  echo "You should run the load-data-into-mongo.sh from inside the scripts/mongo-load directory"
fi

echo "Loading data into mongo..."

#mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c sites --type json --file sites.json --drop

mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metaweatherconditions <username/password> --type json --file metaWeatherConditions.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metawatercolors <username/password> --type json --file metaWaterColors.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metawaterflows <username/password> --type json --file metaWaterFlows.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metashorelinetypes <username/password> --type json --file metaShorelineTypes.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metabioaccumulations <username/password> --type json --file metaBioaccumulations.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metabodiesofwater <username/password> --type json --file metaBodiesOfWater.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metaboroughscounties <username/password> --type json --file metaBoroughsCounties.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metagarbageextents <username/password> --type json --file metaGarbageExtents.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metawinddirections <username/password> --type json --file metaWindDirections.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metatruefalses <username/password> --type json --file metaTrueFalses.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metasubjectareas <username/password> --type json --file metaSubjectAreas.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metaeventtypes <username/password> --type json --file metaEventTypes.json --drop

mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metawatertemperaturemethods <username/password> --type json --file metaWaterTemperatureMethods.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metadissolvedoxygenmethods <username/password> --type json --file metaDissolvedOxygenMethods.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metasalinitymethods <username/password> --type json --file metaSalinityMethods.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metaphmethods <username/password> --type json --file metaPhMethods.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metaturbiditymethods <username/password> --type json --file metaTurbidityMethods.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metaammoniamethods <username/password> --type json --file metaAmmoniaMethods.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metanitratemethods <username/password> --type json --file metaNitrateMethods.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metawatertemperatureunits <username/password> --type json --file metaWaterTemperatureUnits.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metadissolvedoxygenunits <username/password> --type json --file metaDissolvedOxygenUnits.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metasalinityunits <username/password> --type json --file metaSalinityUnits.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metaphunits <username/password> --type json --file metaPhUnits.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metaturbidityunits <username/password> --type json --file metaTurbidityUnits.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metaammoniaunits <username/password> --type json --file metaAmmoniaUnits.json --drop
mongoimport -h ds039195.mlab.com:39195 -d bop-dev -c metanitrateunits <username/password> --type json --file metaNitrateUnits.json --drop

#mongoimport -d bop-dev -c metaorganismcategories --type json --file metaOrganismCategories.json --drop
#mongoimport -d bop-dev -c mobileorganisms --type json --file mobileOrganisms.json --drop
#mongoimport -d bop-dev -c sessileorganisms --type json --file sessileOrganisms.json --drop
#mongoimport -d bop-dev -c metasubjectareas --type json --file metaSubjectAreas.json --drop
