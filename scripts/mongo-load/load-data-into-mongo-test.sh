echo "Loading data into mongo..."

mongoimport -d bop-test -c metaweatherconditions --type json --file scripts/mongo-load/metaWeatherConditions.json --drop
mongoimport -d bop-test -c metawatercolors --type json --file scripts/mongo-load/metaWaterColors.json --drop
mongoimport -d bop-test -c metawaterflows --type json --file scripts/mongo-load/metaWaterFlows.json --drop
mongoimport -d bop-test -c metashorelinetypes --type json --file scripts/mongo-load/metaShorelineTypes.json --drop
mongoimport -d bop-test -c metabioaccumulations --type json --file scripts/mongo-load/metaBioaccumulations.json --drop
mongoimport -d bop-test -c metagarbageextents --type json --file metaGarbageExtents.json --drop
mongoimport -d bop-test -c metawinddirections --type json --file metaWindDirections.json --drop
mongoimport -d bop-test -c metaorganismcategories --type json --file scripts/mongo-load/metaOrganismCategories.json --drop
mongoimport -d bop-test -c metasubjectareas --type json --file scripts/mongo-load/metaSubjectAreas.json --drop
mongoimport -d bop-test -c mobileorganisms --type json --file scripts/mongo-load/mobileOrganisms.json --drop
mongoimport -d bop-test -c sessileorganisms --type json --file scripts/mongo-load/sessileOrganisms.json --drop
mongoimport -d bop-test -c sites --type json --file scripts/mongo-load/sites.json --drop

mongoimport -d bop-test -c metacclselasciencetechnicalsubjects --type json --file scripts/mongo-load/standards/metaEclsElaScienceTechnicalSubjects.json
mongoimport -d bop-test -c metacclsmathematics --type json --file scripts/mongo-load/standards/metaCclsMathematics.json
mongoimport -d bop-test -c metangsscrosscuttingconcepts --type json --file scripts/mongo-load/standards/metaNgssCrossCuttingConcepts.json
mongoimport -d bop-test -c metangssdisciplinarycoreideas --type json --file scripts/mongo-load/standards/metaNgssDisciplinaryCoreIdeas.json
mongoimport -d bop-test -c metangssscienceengineeringpractices --type json --file scripts/mongo-load/standards/metaNgssScienceEngineeringPractices.json
mongoimport -d bop-test -c metanycssunits --type json --file scripts/mongo-load/standards/metaNycssUnits.json
mongoimport -d bop-test -c metanyssskeyideas --type json --file scripts/mongo-load/standards/metaNysssKeyIdeas.json
mongoimport -d bop-test -c metanysssmajorunderstandings --type json --file scripts/mongo-load/standards/metaNysssMajorUnderstandings.json
mongoimport -d bop-test -c metanysssmsts --type json --file scripts/mongo-load/standards/metaNysssMsts.json

mongoimport -d bop-test -c users --type json --file scripts/mongo-load/sample-data-tests/bop-users.json
mongoimport -d bop-test -c schoolorgs --type json --file scripts/mongo-load/sample-data-tests/bop-school-orgs.json
mongoimport -d bop-test -c teams --type json --file scripts/mongo-load/sample-data-tests/bop-teams.json
mongoimport -d bop-test -c restorationstations --type json --file scripts/mongo-load/sample-data-tests/bop-restoration-stations.json

mongoimport -d bop-test -c units --type json --file scripts/mongo-load/sample-data-tests/units.json
mongoimport -d bop-test -c lessons --type json --file scripts/mongo-load/sample-data-tests/lessons.json

mongoimport -d bop-test -c expeditions --type json --file scripts/mongo-load/sample-data-tests/expeditions.json
mongoimport -d bop-test -c protocolsiteconditions --type json --file scripts/mongo-load/sample-data-tests/protocol-site-conditions.json
mongoimport -d bop-test -c protocoloystermeasurements --type json --file scripts/mongo-load/sample-data-tests/protocol-oyster-measurements.json
mongoimport -d bop-test -c protocolmobiletraps --type json --file scripts/mongo-load/sample-data-tests/protocol-mobile-traps.json
mongoimport -d bop-test -c protocolsettlementtiles --type json --file scripts/mongo-load/sample-data-tests/protocol-settlement-tiles.json
mongoimport -d bop-test -c protocolwaterqualities --type json --file scripts/mongo-load/sample-data-tests/protocol-water-qualities.json
