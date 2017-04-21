echo "Loading data into mongo..."

mongoimport -d bop-test -c metaweatherconditions --type json --file scripts/mongo-load/metaWeatherConditions.json --drop
mongoimport -d bop-test -c metawatercolors --type json --file scripts/mongo-load/metaWaterColors.json --drop
mongoimport -d bop-test -c metawaterflows --type json --file scripts/mongo-load/metaWaterFlows.json --drop
mongoimport -d bop-test -c metashorelinetypes --type json --file scripts/mongo-load/metaShorelineTypes.json --drop
mongoimport -d bop-test -c metabioaccumulations --type json --file scripts/mongo-load/metaBioaccumulations.json --drop
mongoimport -d bop-test -c metabodiesofwater --type json --file scripts/mongo-load/metaBodiesOfWater.json --drop
mongoimport -d bop-test -c metaboroughscounties --type json --file scripts/mongo-load/metaBoroughsCounties.json --drop
mongoimport -d bop-test -c metasubjectareas --type json --file scripts/mongo-load/metaSubjectAreas.json --drop
mongoimport -d bop-test -c metaeventtypes --type json --file scripts/mongo-load/metaEventTypes.json --drop

mongoimport -d bop-test -c metagarbageextents --type json --file scripts/mongo-load/metaGarbageExtents.json --drop
mongoimport -d bop-test -c metawinddirections --type json --file scripts/mongo-load/metaWindDirections.json --drop
mongoimport -d bop-test -c metatruefalses --type json --file scripts/mongo-load/metaTrueFalses.json --drop
mongoimport -d bop-test -c metawatertemperaturemethods --type json --file scripts/mongo-load/metaWaterTemperatureMethods.json --drop
mongoimport -d bop-test -c metadissolvedoxygenmethods --type json --file scripts/mongo-load/metaDissolvedOxygenMethods.json --drop
mongoimport -d bop-test -c metasalinitymethods --type json --file scripts/mongo-load/metaSalinityMethods.json --drop
mongoimport -d bop-test -c metaphmethods --type json --file scripts/mongo-load/metaPhMethods.json --drop
mongoimport -d bop-test -c metaturbiditymethods --type json --file scripts/mongo-load/metaTurbidityMethods.json --drop
mongoimport -d bop-test -c metaammoniamethods --type json --file scripts/mongo-load/metaAmmoniaMethods.json --drop
mongoimport -d bop-test -c metanitratemethods --type json --file scripts/mongo-load/metaNitrateMethods.json --drop
mongoimport -d bop-test -c metawatertemperatureunits --type json --file scripts/mongo-load/metaWaterTemperatureUnits.json --drop
mongoimport -d bop-test -c metadissolvedoxygenunits --type json --file scripts/mongo-load/metaDissolvedOxygenUnits.json --drop
mongoimport -d bop-test -c metasalinityunits --type json --file scripts/mongo-load/metaSalinityUnits.json --drop
mongoimport -d bop-test -c metaphunits --type json --file scripts/mongo-load/metaPhUnits.json --drop
mongoimport -d bop-test -c metaturbidityunits --type json --file scripts/mongo-load/metaTurbidityUnits.json --drop
mongoimport -d bop-test -c metaammoniaunits --type json --file scripts/mongo-load/metaAmmoniaUnits.json --drop
mongoimport -d bop-test -c metanitrateunits --type json --file scripts/mongo-load/metaNitrateUnits.json --drop

mongoimport -d bop-test -c metaorganismcategories --type json --file scripts/mongo-load/metaOrganismCategories.json --drop
mongoimport -d bop-test -c metasubjectareas --type json --file scripts/mongo-load/metaSubjectAreas.json --drop
mongoimport -d bop-test -c mobileorganisms --type json --file scripts/mongo-load/mobileOrganisms.json --drop
mongoimport -d bop-test -c sessileorganisms --type json --file scripts/mongo-load/sessileOrganisms.json --drop
mongoimport -d bop-test -c sites --type json --file scripts/mongo-load/sites.json --drop

mongoimport -d bop-test -c metacclselasciencetechnicalsubjects --type json --file scripts/mongo-load/standards/metaEclsElaScienceTechnicalSubjects.json --drop
mongoimport -d bop-test -c metacclsmathematics --type json --file scripts/mongo-load/standards/metaCclsMathematics.json --drop
mongoimport -d bop-test -c metangsscrosscuttingconcepts --type json --file scripts/mongo-load/standards/metaNgssCrossCuttingConcepts.json --drop
mongoimport -d bop-test -c metangssdisciplinarycoreideas --type json --file scripts/mongo-load/standards/metaNgssDisciplinaryCoreIdeas.json --drop
mongoimport -d bop-test -c metangssscienceengineeringpractices --type json --file scripts/mongo-load/standards/metaNgssScienceEngineeringPractices.json --drop
mongoimport -d bop-test -c metanycssunits --type json --file scripts/mongo-load/standards/metaNycssUnits.json --drop
mongoimport -d bop-test -c metanyssskeyideas --type json --file scripts/mongo-load/standards/metaNysssKeyIdeas.json --drop
mongoimport -d bop-test -c metanysssmajorunderstandings --type json --file scripts/mongo-load/standards/metaNysssMajorUnderstandings.json --drop
mongoimport -d bop-test -c metanysssmsts --type json --file scripts/mongo-load/standards/metaNysssMsts.json --drop

mongoimport -d bop-test -c metapropertyowners --type json --file scripts/mongo-load/sample-data-tests/bop-property-owners.json --drop
mongoimport -d bop-test -c schoolorgs --type json --file scripts/mongo-load/sample-data-tests/bop-school-orgs.json --drop
mongoimport -d bop-test -c users --type json --file scripts/mongo-load/sample-data-tests/bop-users.json --drop
mongoimport -d bop-test -c teams --type json --file scripts/mongo-load/sample-data-tests/bop-teams.json --drop
mongoimport -d bop-test -c restorationstations --type json --file scripts/mongo-load/sample-data-tests/bop-restoration-stations.json --drop

mongoimport -d bop-test -c units --type json --file scripts/mongo-load/sample-data-tests/units.json --drop
mongoimport -d bop-test -c lessons --type json --file scripts/mongo-load/sample-data-tests/lessons.json --drop

mongoimport -d bop-test -c expeditions --type json --file scripts/mongo-load/sample-data-tests/expeditions.json --drop
mongoimport -d bop-test -c protocolsiteconditions --type json --file scripts/mongo-load/sample-data-tests/protocol-site-conditions.json --drop
mongoimport -d bop-test -c protocoloystermeasurements --type json --file scripts/mongo-load/sample-data-tests/protocol-oyster-measurements.json --drop
mongoimport -d bop-test -c protocolmobiletraps --type json --file scripts/mongo-load/sample-data-tests/protocol-mobile-traps.json --drop
mongoimport -d bop-test -c protocolsettlementtiles --type json --file scripts/mongo-load/sample-data-tests/protocol-settlement-tiles.json --drop
mongoimport -d bop-test -c protocolwaterqualities --type json --file scripts/mongo-load/sample-data-tests/protocol-water-qualities.json --drop
