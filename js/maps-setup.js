/* global L:false document:false $:false */
// that first line stops your editor from complaining about these variables
// being undefined, but it will still get mad at you if you accidentlaly try to change
// their values (which you must not do!!)
// `L` is the global Leaflet API object, which must be defined before this
// script is loaded
// `document` is of course the HTML document
// $ is the jQuery object (actually we're not using it here at the moment)
// but just in case you would like to make use of it, it's available


///////////////////////////////////////////////
// VARS!! VARS!! VARS!! VARS!! VARS!! VARS!! //
///////////////////////////////////////////////

//////////////////////////
// Globally Scoped Vars //
//////////////////////////

// In order to access map data, we need some of these variables to
// be defined in global scope. In some cases we can assign values here;
// in others we'll wait till we run the initialization function
// we do this here to make sure we can access them
// whenever we need to -- they have 'global scope'

// map initialization variables
let projectMap, // this will hold the map once it's initialized
    myCenter =  [ 33.10939131944678, 131.50954309381356 ], // [ 55.4907, -1.594], // *latitude*, then longitude
    myZoom = 7; // set your preferred zoom here. higher number is closer in.
                // I set the zoom wide to give access to context before zooming in


// I'm complicating things a bit with this next set of variables, which will help us
// to make multi-colored markers.
// color options are red, blue, green, orange, yellow, violet, grey, black
// to use one of the ones I haven't provided here, 
// just substitute the color name in the URL value (just before `.png`)
const greenURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      yellowURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
      greyURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';

// create new icon classes
// I've added this just in case you want very fine control over your marker placement
const myIconClass = L.Icon.extend({
    options: {
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }});
// create the new icon types -- cf. https://leafletjs.com/examples/custom-icons/ and
// also https://leafletjs.com/reference-1.5.0.html#icon
const gryfIcon = new myIconClass({iconUrl: yellowURL}),
      slythIcon = new myIconClass({iconUrl: greenURL}),
      mysteryIcon = new myIconClass({iconUrl: greyURL});


// storing colors in variables, to make it easier to change all the related features at once
// you should probably do this too. 
let gryfCol = 'yellow',
    slythCol = 'green',
    hogCol = 'grey',
    meadeCol = 'rgb(40,40,120)',
    towerCol = 'blue';

///////////////////////////////////////////////////////////////////////
// CHANGE THESE VARIABLE NAMES AND THEIR VALUES TO SUIT YOUR PROJECT //
// It's easy to do this in VSCode: right-click on a variable name    //
// and choose "rename symbol"                                        //
///////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////
// DATA DATA DATA DATA                                  //
// DATA DATA DATA DATA                                  //
//////////////////////////////////////////////////////////


//////////////////////////////////
// MAP DATA PART 1: MARKER INFO //
//////////////////////////////////

///////////////////////////////
// YOU NEED TO CHANGE THESE! //
///////////////////////////////

// These are placeholder arrays; we use them to generate other JS variables
// that will be more useful to us later on
// but writing them this way keeps the code as D.R.Y. as possible
let hiroshimapeacepark =
    [
        {position: [ 34.39292585118296, 132.45255337927574 ],
         title: "Cenotaph for the A-bomb Victims",
         description: '<p>The inscription reads: .</p>'
        },
        {position: [ 34.39181370429739, 132.45212742502892 ],
         title: "Hiroshima Peace Memorial Museum",
         description: `<p>Exhibits.</p>`
        },
        {position: [ 34.39292986770104, 132.4531190159095 ],
         title: "National Hiroshima Peace Memorial Hall",
         description: `<p>Opened in 2002/</p>`},
        {position: [ 34.393453229205925, 132.45275983366514 ],
         title: "Peace Light",
         description: '<p>The fire has been burning since August 1, 1964.</p>'},
         {position: [ 34.39428475593624, 132.4518720636231 ],
            title: "Korean Atomic Bomb Victims Memorial",
            icon: mysteryIcon,
            description: '<p>Constructed on April 10, 1970.</p>'},
        {position: [ 34.39547749360947, 132.45356903941789 ],
         title: "Atomic Bomb Dome",
         description: `<p>A UNESCO World Heritage Site</p>`}
    ],
    gryfMarkerInfo =
    [{position: [55.49058639152367,-1.5951092937469482],
      title: "Dumbledore Lies Dying",
      description: "<p>Afflicted by a curse for over a year, and gravely weakened by a powerful poison, Dumbledore lies on the ground, barely mobile.</p>"
     }];


let gryfMarkers = processMarkerLayer(gryfMarkerInfo,
                                     {description: 'Gryffindor: People and Places', defaultIcon: gryfIcon}),
    hiroshimaMarkers = processMarkerLayer(hiroshimapeacepark,
                                      {description: 'Hiroshima Peace Memorial Park', defaultIcon: slythIcon});



//////////////////////////////
// MAP DATA PART 2: GEOJSON //
//////////////////////////////

// With this powerful feature you can add arbitrary
// data layers to your map.  It's cool. Learn more at:
// https://leafletjs.com/examples/geojson/
// but essentially: we can add all kinds of features here, including polygons and other shapes
// you can create geoJSON layers here: http://geojson.io/
// and learn more about the format here: https://en.wikipedia.org/wiki/GeoJSON
// to set the line and fill color, you will need to set the `myColor` property as below. 
    const townsData={
        "type": "FeatureCollection",
        "description": "Memorials",
      "features": [
        {
          "type": "Feature",
            "properties": {myColor: hogCol, title: "Hiroshima Peace Park Memorial", description: "Established in " },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                  [
                    129.8624324798584,
                    32.77438008592417
                  ],
                  [
                    129.86309230327606,
                    32.77463267074292
                  ],
                  [
                    129.86321568489075,
                    32.77470934813534
                  ],
                  [
                    129.86341416835785,
                    32.77504311954437
                  ],
                  [
                    129.8636394739151,
                    32.77503409871193
                  ],
                  [
                    129.8636770248413,
                    32.775205494371775
                  ],
                  [
                    129.8637467622757,
                    32.77540846248942
                  ],
                  [
                    129.86393988132477,
                    32.775742231276325
                  ],
                  [
                    129.8640739917755,
                    32.77586852184223
                  ],
                  [
                    129.86401498317719,
                    32.776125612797536
                  ],
                  [
                    129.86443877220154,
                    32.77659017878043
                  ],
                  [
                    129.86464262008667,
                    32.77698257728426
                  ],
                  [
                    129.8645406961441,
                    32.77698257728426
                  ],
                  [
                    129.86376285552979,
                    32.77731182986616
                  ],
                  [
                    129.8632800579071,
                    32.776545075393244
                  ],
                  [
                    129.86273288726807,
                    32.77617973711454
                  ],
                  [
                    129.86293137073517,
                    32.77613914387987
                  ],
                  [
                    129.86283481121063,
                    32.776012853698056
                  ],
                  [
                    129.86275970935822,
                    32.77586852184223
                  ],
                  [
                    129.86272215843198,
                    32.77587303221626
                  ],
                  [
                    129.86262023448944,
                    32.775620450918055
                  ],
                  [
                    129.86250758171082,
                    32.77562947169106
                  ],
                  [
                    129.86243784427643,
                    32.77555730548148
                  ],
                  [
                    129.86243784427643,
                    32.7752866816744
                  ],
                  [
                    129.86251294612885,
                    32.77497095285928
                  ],
                  [
                    129.86249148845673,
                    32.77496193201954
                  ],
                  [
                    129.862539768219,
                    32.774731900297
                  ],
                  [
                    129.86236810684204,
                    32.7746822855338
                  ],
                  [
                    129.8624324798584,
                    32.77438008592417
                  ]
                ]
              ]
          }
        },
        {
          "type": "Feature",
            "properties": {myColor: meadeCol, title: "Nagasaki Peace Park", description: "Established "},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                  [
                    129.8624324798584,
                    32.77438008592417
                  ],
                  [
                    129.86309230327606,
                    32.77463267074292
                  ],
                  [
                    129.86321568489075,
                    32.77470934813534
                  ],
                  [
                    129.86341416835785,
                    32.77504311954437
                  ],
                  [
                    129.8636394739151,
                    32.77503409871193
                  ],
                  [
                    129.8636770248413,
                    32.775205494371775
                  ],
                  [
                    129.8637467622757,
                    32.77540846248942
                  ],
                  [
                    129.86393988132477,
                    32.775742231276325
                  ],
                  [
                    129.8640739917755,
                    32.77586852184223
                  ],
                  [
                    129.86401498317719,
                    32.776125612797536
                  ],
                  [
                    129.86443877220154,
                    32.77659017878043
                  ],
                  [
                    129.86464262008667,
                    32.77698257728426
                  ],
                  [
                    129.8645406961441,
                    32.77698257728426
                  ],
                  [
                    129.86376285552979,
                    32.77731182986616
                  ],
                  [
                    129.8632800579071,
                    32.776545075393244
                  ],
                  [
                    129.86273288726807,
                    32.77617973711454
                  ],
                  [
                    129.86293137073517,
                    32.77613914387987
                  ],
                  [
                    129.86283481121063,
                    32.776012853698056
                  ],
                  [
                    129.86275970935822,
                    32.77586852184223
                  ],
                  [
                    129.86272215843198,
                    32.77587303221626
                  ],
                  [
                    129.86262023448944,
                    32.775620450918055
                  ],
                  [
                    129.86250758171082,
                    32.77562947169106
                  ],
                  [
                    129.86243784427643,
                    32.77555730548148
                  ],
                  [
                    129.86243784427643,
                    32.7752866816744
                  ],
                  [
                    129.86251294612885,
                    32.77497095285928
                  ],
                  [
                    129.86249148845673,
                    32.77496193201954
                  ],
                  [
                    129.862539768219,
                    32.774731900297
                  ],
                  [
                    129.86236810684204,
                    32.7746822855338
                  ],
                  [
                    129.8624324798584,
                    32.77438008592417
                  ]
                ]
              ]
          }
        }
      ]
    }
let towns = processJSONLayer(townsData)

////////////////////////////////////////////////////////
// MAP DATA PART 3: DIRECT CREATION OF SHAPE OVERLAYS //
////////////////////////////////////////////////////////


// Hogwarts Buildings Objects and LayerGroup
// API docs: https://leafletjs.com/reference-1.5.0.html#polygon
//  (keep scrolling for docs on rectangles and circles)
let gryffindor = L.rectangle([[ 55.49021561150901, -1.5941441059112549],
                              [55.49107265510559,-1.5931355953216553]], {
    color: gryfCol,
    opacity: 0.8,
    weight: 2,
    fillColor: gryfCol,
    fillOpacity: 0.35,
    title: 'Gryffindor',
    windowContent: `<h3>Gryffindor</h3><p>The Good Guys Live here</p3>`
});

let slytherin = L.rectangle([[ 55.48954090449621, -1.5956997871398926], [55.490288552115494, -1.594712734222412]], {
    color: 'blue',
    opacity: 0.8,
    weight: 2,
    fillColor: slythCol,
    fillOpacity: 0.35,
    title: 'Slytherin',
    windowContent: `<h3>Slytherin</h3><p>The Bad Guys Live here</p3>`
});

let headmasterTower = L.circle([55.4907, -1.5944], {
    color: towerCol,
    opacity: 0.8,
    weight: 2,
    fillColor: towerCol,
    fillOpacity: 0.35,
    radius: 40,
    title: 'Headmaster\'s Tower',
    windowContent: `<h3>Headmaster's Tower</h3><p>Scene of the the Fatal Act.</p>`
});

let houses = processManualLayers([gryffindor, slytherin, headmasterTower],
                                 {description: 'Important Hogwarts Buildings'});




// Polyline Objects and Layer Group ("paths")
let vanishingPath = L.polyline([[51.37178037591737, -0.2197265625],
                                [55.36857598381045, -1.7512893676757812],
                                [55.48997247517858,-1.5944015979766843 ]], {
                                    color: slythCol,
                                    weight: 6,
                                    title: 'DeathEaters Travel',
                                    windowContent: `<h3>Line of Travel for Deatheaters</h3><p>From the twin Vanishing Cabinet, the Deatheraters can travel directly from Bourquin and Burkes</p>`})


let tunnelPath = L.polyline([[55.49065933144361,-1.6042077541351318],
                                [55.49027247517858,-1.5943015979766843 ]], {
                                    color: gryfCol,
                                    weight: 6,
                                    title: 'Tunnel to Hogsmeade',
                                    windowContent: `<h3>Marauders' Map Tunnel</h3><p>Not really sure why this worked in the first ocuple of books.</p>`})

let horcruxPath = L.polyline([[55.49058639152367,-1.5951092937469482],
                              [55.61679475360749,-1.6392910480499268]], {
                                  color: gryfCol,
                                  weight: 4,
                                  title: 'Return from Horcrux quest',
                                  windowContent: `<h3>Return Disapparation from Failed Horcrux quest</h3><p>Exhaisted and grieviously injured, Dumbledore returns to find the trap he had so long expected has been sprung.</p>`})
let paths = processManualLayers([vanishingPath, tunnelPath, horcruxPath], {description: 'Paths'})


////////////////////////////////////////////////
// array of all the layers!!!!!!!
// these layers will be added to the map
// you should change these variable names
// to align with the variables you've defiend above
let allLayers = [gryfMarkers, hiroshimaMarkers, towns, houses, paths];


///////////////////////////////////////
// END DATA!!  END DATA!! END DATA!! //
///////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////
// FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS //
/////////////////////////////////////////////


/**
 * create a Leaflet map inside an element, add base layer and return the map as a return value
 * @param {HTMLElement|string} element: can be either a full HTMLElement or the ID attribute
 * of a DOM node
 * @returns {Object} a Leaflet map object 
 */
function createMap (element) {
    const map = L.map(element, {renderer:L.canvas(), preferCanvas: true}).setView(myCenter, myZoom);
    // now we add the base layer
    // you can change this if you want!
    // if your tiles seem to load very slowly, you may want to generate your own accessToken
    // and insert the value in `accessToken`, below. 
    // see: https://docs.mapbox.com/help/how-mapbox-works/access-tokens/#creating-and-managing-access-tokens

    // to change the tile layer, change the `id` attribute below.
    // some valid options include:
    // mapbox/streets-v11
    // mapbox/outdoors-v11
    // mapbox/light-v10
    // mapbox/dark-v10
    // mapbox/satellite-v9
    // mapbox/satellite-streets-v11

    // I've also created a simple style using studio.mapbox.com, which you can access
    // with this id:
    // titaniumbones/ckhnvk5pl18o71apeq8q1duhc
    // You can modify it yourself using this link: 
    // https://api.mapbox.com/styles/v1/titaniumbones/ckhnvk5pl18o71apeq8q1duhc.html?fresh=true&title=copy&access_token=pk.eyJ1IjoidGl0YW5pdW1ib25lcyIsImEiOiJjazF0bTdlNXQwM3gxM2hwbXY0bWtiamM3In0.FFPm7UIuj_b15xnd7wOQig
    // Here's a green and blue one for good measure:
    // https://api.mapbox.com/styles/v1/titaniumbones/ckhnvqfda18qu19o2oool6h2c.html?fresh=true&title=copy&access_token=pk.eyJ1IjoidGl0YW5pdW1ib25lcyIsImEiOiJjazF0bTdlNXQwM3gxM2hwbXY0bWtiamM3In0.FFPm7UIuj_b15xnd7wOQig
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
        id: 'mapbox/dark-v10',
        // id: 'titaniumbones/ckhnvk5pl18o71apeq8q1duhc',
        tileSize: 512,
        zoomOffset: -1,
	accessToken: 'pk.eyJ1IjoidGl0YW5pdW1ib25lcyIsImEiOiJjazF0bTdlNXQwM3gxM2hwbXY0bWtiamM3In0.FFPm7UIuj_b15xnd7wOQig'
    })
        .addTo(map);
    return map
}


/**
 * Add Markers to a "layerGroup" and return the populated object
 * @param {Array.<Object>} markerInfo
 * @param {string} markerInfo[].title
 * @param {Array|Object} markerInfo[].position
 * @param {Object} layerGroup
 * @returns {Object} the modified layerGroup object 
 */
function processMarkerLayer (markerInfo, options) {
    let layerGroup = L.layerGroup([], options);
    // iterate over the marker info array, adding to the main marker layer but
    // *also* to another layer if the icon property is set. 
    for (const m of markerInfo) {
        // define a Leaflet marker object for each marker
        // we pass two parameters: a position (2-value array of lat & lng vals)
        // and an object containing marker propertie
        let marker =  L.marker (m.position, {
            // We set the icon 
            icon:   m.icon || layerGroup.options.defaultIcon || L.Icon(),
            title: m.title,
            description: m.description,
            windowContent: m.windowContent //this is obsolete
        });
        let t = assembleTexts(marker);
        marker.bindPopup(t.popup);
        // this seems to be unnecessary on modern browsers for some reason
        //marker.bindTooltip(t.tooltip);
        layerGroup.addLayer(marker);
    }
    return layerGroup;
}

/**
 * create a geoJSON layer and return the geoJSON layer object.
 * If the featureGroup has the non-standard property
 * 'description' it will be explicitly set on the returned object as well.
 * If an individual feature has the property feature.properties.title,
 * then the options.title property will be set on the resultant layer
 * for compatibility with marker layers.
 * The custom property `feature.properties.myColor` will also be used to set line and
 * fill colors.
 * 
 * @param {GeoJSON} jsonData
 * @returns {Object} the newly-created geoJSON layer 
 */
function processJSONLayer (jsonData) {
    return L.geoJSON(jsonData, {
        // the 'style' option is a *function* that modifies some
        // feature properties.  
        // cf https://leafletjs.com/reference-1.5.0.html#geojson-style
        style: function(feature) {
            let c = feature.properties.myColor;
            return {color: c, weight: 3, fillColor: c, fillOpacity: 0.5};
        },
        onEachFeature: function (feature, layer) {
            layer.options.description = '';
            if (feature.properties ) {
                if (feature.properties.title) {
                    layer.options.title = feature.properties.title;
                }
                if (feature.properties.description) {
                    layer.options.description = feature.properties.description;
                }
            }
            let t = assembleTexts(layer);
            layer.bindPopup(t.popup);
            layer.bindTooltip(t.tooltip, {sticky: true});
        },
        description: jsonData.description || "GeoJSON Objects"
    });
}

/**
 * create a layerGroup from an array of individual Layer objects.
 * If the non-standard options `windowContent`, `title`, and/or `description` have been
 * set, they will be used to create a popup window and tooltip now, and
 * to generate legend text in `addLayerToLegendHTML` later on.
 * The `options` parameter should include a `description` property,
 * (NOTE: this is *separate* from the description of the individual layers!!)
 * which will also be used by `addLayerToLegendHTML` and in the layers
 * control box. 
 * @param {} layerArray
 * @param {} options
 * @returns {} 
 */
function processManualLayers (layerArray, options = {description: 'Unnamed Layer'}) {
    for (const l of layerArray) {
        let t = assembleTexts(l);
        l.bindPopup(t.popup);
        l.bindTooltip(t.tooltip, {sticky: true});
    }
    return L.layerGroup(layerArray, options)
}


function assembleTexts (feature) {
    let opts = feature.options,
        tooltip = 'Untitled Tooltip',
        popup = '<h2>Untitled</h2>',
        legend = 'Untitled';
    
    if (opts.title) {
        popup = `<h2>${opts.title}</h2>` + (opts.description || '');
        tooltip = opts.title;
        legend = opts.title;
    }
    if (opts.windowContent) {
        popup = opts.windowContent;
    }
    return {tooltip: tooltip, popup: popup, legend: legend};
}
/**
 * For every element of `layerGroup`, add an entry to the innerHTML of
 * the element matched by `querySelector`, consisting of a div whose
 * `onclick` attribute is a call to `locateMapFeature` which navigates to, and
 * opens the popup window of, that feature.  The link text will be one of `options.infoHTML`,
 * `options.title`, or 'no title', in that order.
 * @param {Array} layerGroup
 * @param {string} querySelector
 * @returns {string} innerHTML content of the legend element 
 */
function addLayerToLegendHTML (layerGroup, el) {
    let output = `<div class="legend-content-group-wrapper"><h2>${layerGroup.options.description}</h2>`;
    for (let l in layerGroup._layers) {
        // this is hideously ugly! very roundabout way
        // to access anonymous marker from outside the map
        let current = layerGroup._layers[l];
        let info = assembleTexts(current).legend;
        output +=  `
<div class="pointer" onclick="locateMapFeature(projectMap._layers[${layerGroup._leaflet_id}]._layers[${l}])"> 
    ${info} 
</div>`;
    }
    output += '</div>'
    el.innerHTML += output;
    return el.innerHTML
}

/* a function that will run when the page loads.  It creates the map
   and adds the existing layers to it. You probably don't need to change this function; 
   instead, change data and variable names above, or change some of the helper functions that
   precede this function.
 */
async function initializeMap() {

    // this one line creates the actual map
    // it calls a simple 2-line function defined above
    projectMap = createMap('map_canvas');
    // set the legend location
    let legendEl = document.querySelector('#map_legend');

    let layerListObject = {};
    // add markers to map and to legend, then add a toggle switch to layers control panel
    for (let l of allLayers) {
        l.addTo(projectMap);
        addLayerToLegendHTML(l, legendEl);
        layerListObject[l.options.description] = l;
    }

   // add a layers control to the map, using the layer list object
    // assigned above
    L.control.layers(null, layerListObject).addTo(projectMap);

    // You'll want to comment this out before handing in, but it makes life a bit easier.
    // while you're developing
    coordHelp();
}

/**
 * pan to object if it's a marker; otherwise use the `fitBounds` method on the feature
 * Then open the marker popup.
 * @param {Object} marker
 */
function locateMapFeature (marker) {
    marker.getLatLng ? projectMap.flyTo(marker.getLatLng(), 16, {animate: true, duration: 1.5}) : projectMap.fitBounds(marker.getBounds(), {animate: true, duration: 1.5}); 
    marker.openPopup();
}

function coordHelp () {
    projectMap.on('click', function(e) {
        console.log("Lat, Lon : [ " + e.latlng.lat + ", " + e.latlng.lng + " ]")
    });
}

function resetMap (map) {
    map.setView(myCenter, myZoom, {animate: true, duration: 1.5}).closePopups()
}
