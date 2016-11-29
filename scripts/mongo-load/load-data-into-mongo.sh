#!/bin/bash

if [ ! -e sites.json ]
then
  echo "Error: couldn't not find data/sites.json file"
  echo "You should run the load-data-into-mongo.sh from inside the scripts/mongo-load directory"
fi

echo "Loading data into mongo..."

mongoimport -d bop-dev -c sites --type json --file sites.json --drop

mongoimport -d bop-dev -c metaweatherconditions --type json --file metaWeatherConditions.json --drop
mongoimport -d bop-dev -c metawatercolors --type json --file metaWaterColors.json --drop
mongoimport -d bop-dev -c metawaterflows --type json --file metaWaterFlows.json --drop
mongoimport -d bop-dev -c metashorelinetypes --type json --file metaShorelineTypes.json --drop
mongoimport -d bop-dev -c metabioaccumulations --type json --file metaBioaccumulations.json --drop
mongoimport -d bop-dev -c metagarbageextents --type json --file metaGarbageExtents.json --drop
mongoimport -d bop-dev -c metawinddirections --type json --file metaWindDirections.json --drop
mongoimport -d bop-dev -c metatruefalses --type json --file metaTrueFalses.json --drop
mongoimport -d bop-dev -c metawatertemperaturemethods --type json --file metaWaterTemperatureMethods.json --drop
mongoimport -d bop-dev -c metadissolvedoxygenmethods --type json --file metaDissolvedOxygenMethods.json --drop
mongoimport -d bop-dev -c metasalinitymethods --type json --file metaSalinityMethods.json --drop
mongoimport -d bop-dev -c metaphmethods --type json --file metaPhMethods.json --drop
mongoimport -d bop-dev -c metaturbiditymethods --type json --file metaTurbidityMethods.json --drop
mongoimport -d bop-dev -c metaammoniamethods --type json --file metaAmmoniaMethods.json --drop
mongoimport -d bop-dev -c metanitratemethods --type json --file metaNitrateMethods.json --drop
mongoimport -d bop-dev -c metawatertemperatureunits --type json --file metaWaterTemperatureUnits.json --drop
mongoimport -d bop-dev -c metadissolvedoxygenunits --type json --file metaDissolvedOxygenUnits.json --drop
mongoimport -d bop-dev -c metasalinityunits --type json --file metaSalinityUnits.json --drop
mongoimport -d bop-dev -c metaphunits --type json --file metaPhUnits.json --drop
mongoimport -d bop-dev -c metaturbidityunits --type json --file metaTurbidityUnits.json --drop
mongoimport -d bop-dev -c metaammoniaunits --type json --file metaAmmoniaUnits.json --drop
mongoimport -d bop-dev -c metanitrateunits --type json --file metaNitrateUnits.json --drop

mongoimport -d bop-dev -c metaorganismcategories --type json --file metaOrganismCategories.json --drop
mongoimport -d bop-dev -c mobileorganisms --type json --file mobileOrganisms.json --drop
mongoimport -d bop-dev -c sessileorganisms --type json --file sessileOrganisms.json --drop
mongoimport -d bop-dev -c metasubjectareas --type json --file metaSubjectAreas.json --drop
mongoimport -d bop-dev -c metabodiesofwater --type json --file metaBodiesOfWater.json --drop
mongoimport -d bop-dev -c metaboroughscounties --type json --file metaBoroughsCounties.json --drop
mongoimport -d bop-dev -c metasubjectareas --type json --file metaSubjectAreas.json --drop
mongoimport -d bop-dev -c metaeventtypes --type json --file metaEventTypes.json --drop
#mongoimport -d bop-dev -c glossaries --type json --file sample-data/bop-dev-glossaries.json
#mongoimport -d bop-dev -c lessons --type json --file sample-data/bop-dev-lessons.json
#mongoimport -d bop-dev -c units --type json --file sample-data/bop-dev-units.json
#mongoimport -d bop-dev -c users --type json --file sample-data/bop-dev-users.json
#mongoimport -d bop-dev -c teams --type json --file sample-data/bop-dev-teams.json
