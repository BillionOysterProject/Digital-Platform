# Billion Oyster Project Digital Platform (BOP-662)

This project is based off the <a href="http://meanjs.org/">MEAN.js stack</a> 

## Map Select Directive
### Usage
* <map-select modal-id="modal-map-sample{{$index}}" can-click-map-to-add-marker="true" can-geocode="true" can-move-marker="true" show-marker="true"
latitude="sample.locationOfWaterSample.latitude" longitude="sample.locationOfWaterSample.longitude"></map-select>
* *modal-id(@)* - if this directive is wrapped in a modal, pass the id so the directive can tell whem the modal is visible(shown) so that the map can render correctly
* *can-click-map-to-add-marker=":" - boolean to determine if map clicks that add a marker are allowed
* *can-geocode(=)* - if true the googleGeocode directive is shown
* *show-marker(=)* - if true the map marker is visible
* *can-move-marker(=)* - if true the map marker is draggable if it is visible
* *latitude(=)* - can set the latitude displayed
* *longitude(=)* - can set the longitude displayed


### Items To Note
* the directive uses standard leaflet and not the leaflet directive
* the directive uses its link function to set the id of the leaflet map since the ids need to be unique whenever the directive is used, this can be generated in a Service too
* hbostic added leaflet.client.service to make the global window.L object available to angular and pass linting, not sure what the BOP team does for globals  

## Leaflet Map Directive
### Usage
* <leaflet-map map-controls="vm.mapControls" map-click-event="vm.mapClick" marker-drag-end-event="vm.markerDragEnd" can-click-map-to-add-marker="true"
                                 can-move-marker="vm.canMoveMarker" show-marker="vm.showMarker" add-points="[{lat:40.668514 , lng:-74.077721,icon: {icon: 'glyphicon-map-marker',  prefix: 'glyphicon',markerColor: 'green'}},
                                                                                                {lat:40.600774 , lng:-74.056435,icon: {icon: 'glyphicon-map-marker',  prefix: 'glyphicon',markerColor: 'red'}},
                                                                                                {lat:40.545488 , lng:-73.949318,icon: {icon: 'glyphicon-map-marker',  prefix: 'glyphicon',markerColor: 'green'}}]"></leaflet-map>
* *map-controls(=)* - empty object that the directive attaches internal functions to so the calling controller can call functions
* *map-click-event(&)* - function to call if when the map is clicked
* *marker-drag-end-event(&)* - function to call when marker drag is done
* *show-marker(=)* - if true the map marker is visible
* *can-move-marker(=)* - if true the map marker is draggable if it is visible
* *add-points(=)* - an array of point objects with associated icon to be loaded on the map, overridding any existing points
* *can-click-map-to-add-marker=":" - boolean to determine if map clicks that add a marker are allowed


### Items To Note
* the directive uses standard leaflet and not the leaflet directive
*the directive uses HBOSTIC personal mapbox basemap and needs to be updated for production use
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
