# Billion Oyster Project Digital Platform (BOP-662)

This project is based off the <a href="http://meanjs.org/">MEAN.js stack</a> 

## Map Select Directive
### Usage
* <map-select modal-id="modal-map-sample{{$index}}" can-geocode="true" latitude="sample.locationOfWaterSample.latitude" longitude="sample.locationOfWaterSample.longitude"></map-select>
* *modal-id(@)* - if this directive is wrapped in a modal, pass the id so the directive can tell whem the modal is visible(shown) so that the map can render correctly
* *can-geocode(=)* - if true the googleGeocode directive is shown
* *latitude(=)* - can set the latitude displayed
* *longitude(=)* - can set the longitude displayed


### Items To Note
* the directive uses standard leaflet and not the leaflet directive
* the directive uses its link function to set the id of the leaflet map since the ids need to be unique whenever the directive is used, this can be generated in a Service too
* hbostic added leaflet.client.service to make the global window.L object available to angular and pass linting, not sure what the BOP team does for globals  

## Google Geocode Directive
### Usage
* <google-geocode place-selected="vm.placeSelected"></google-geocode>
* *place-selected(&)* - function to call when a place is selected 


### Items To Note
* uses the google geocode service
* only responds to selected items by way of click in the list of results or enter key on a result option (set in controller and can be modified)
* had to add 'ui.bootstrap.tpls' to the app module, could have just added it to forms module
* the search results need to be above the zoom in/out button of the map, styling needed
