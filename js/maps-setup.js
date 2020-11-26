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
const NagIcon = new myIconClass({iconUrl: yellowURL}),
      HirIcon = new myIconClass({iconUrl: greenURL}),
      mysteryIcon = new myIconClass({iconUrl: greyURL});


// storing colors in variables, to make it easier to change all the related features at once
// you should probably do this too. 
let NagCol = 'yellow',
    HirCol = 'green',
    HirParkCol = 'green',
    NagParkCol = 'yellow',
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
        {position: [ 34.39298567151763, 132.45252875707192 ],
         title: "Cenotaph for the A-bomb Victims",
         description: '<p>The epitaph reads: "Please rest in peace (yasuraka ni nemutte kudasai), / For we shall not repeat the mistake (ayamachi wa kurikaeshimasenu kara)." .</p>'
        },
        {position: [ 34.39181370429739, 132.45212742502892 ],
         title: "Hiroshima Peace Memorial Museum",
         description: `<p>Composed of exhibits such as: Reality of the Atomic Bombing, The Dangers of Nuclear Weapons, and Hiroshima History.</p>`
        },
        {position: [ 34.39301346805282, 132.45327164607218 ],
         title: "National Hiroshima Peace Memorial Hall",
         description: `<p>Opened in 2002 as a space of prayer and reflection.</p>`},
        {position: [ 34.39413439776468, 132.45277253745488 ],
         title: "Children's Peace Monument", 
         description: '<p>In memory of the death of innocent children.</p>'},
         {position: [ 34.39428475593624, 132.4518720636231 ],
            title: "Korean Atomic Bomb Victims Memorial",
            icon: mysteryIcon,
            description: '<p>Moved to this location in 1990.</p>'},
        {position: [ 34.394513607625484, 132.4498207777244 ],
            title: "Former location of the Korean Atomic Bomb Victims Memorial",
            icon: mysteryIcon,
            description: '<p>Constructed on April 10, 1970.</p>'},   
        {position: [ 34.39547749360947, 132.45356903941789 ],
         title: "Atomic Bomb Dome",
         description: `<p>A UNESCO World Heritage Site. One of the only building structures that was not completely destroyed by the atomic bomb.</p>`},
         {position: [ 34.3913882257594, 132.45196602158487 ],
            title: "Prayer Fountain",
            description: `<p>In memory of those who died while pleading for water.</p>`},
         {position: [ 34.39348990573147, 132.45269278087534 ],
            title: "Flame of Peace",
            description: `<p>This flame has been burning since August 1, 1964.</p>`}
    ],
    nagasakipeacepark =
    [
      {position: [ 32.77692958103568, 129.8639428988099 ],
      title: "Peace Statue",
      description: "<p>Inscription from the sculptor Seibo Kitamura: 'The right hand shows the atomic bomb, the left hand prays for peace, and the face prays for the souls of the war victims.'</p>"
     },
     {position: [ 32.775444545661884, 129.86305609345436 ],
        title: "Fountain of Peace",
        description: `<p>Created in 1969 in memory of the A-bomb victims who died in search for water.</p>`},
    {position: [ 32.77373219188245, 129.86322358762905 ],
        title: "Hypocenter Cenotaph",
        description: `<p>The A-bomb exploded 500 metres above this point.</p>`},
    {position: [ 32.772608504822784, 129.86456629471718 ],
        title: "Nagasaki Atomic Bomb Memorial",
        description: `<p>Photographs, lectures, videos, and documentaries are available here for the purposes of education.</p>`},
    {position: [ 32.7724994228233, 129.8635187690558 ],
        title: "Nagasaki Korean Atomic Bomb Victims' Memorial",
        icon: mysteryIcon,
        description: `<p>Erected in August 1976. The inscription reads: "For Koreans and their families who died during heavy labor due to forced entrainment and recruitment."</p>`},
    {position: [ 32.775977516264064, 129.8633015837938 ],
        title: "Monument of People's Friendship",
        description: `<p>Donated by the former German Democratic Republic.</p>`},
      ];


let nagasakiMarkers = processMarkerLayer(nagasakipeacepark,
                                     {description: 'Nagasaki Peace Park', defaultIcon: NagIcon}),
    hiroshimaMarkers = processMarkerLayer(hiroshimapeacepark,
                                      {description: 'Hiroshima Peace Memorial Park', defaultIcon: HirIcon});



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
const parksData={
  "type": "FeatureCollection",
  "description": "Memorial Spaces",
"features": [
  {
    "type": "Feature",
      "properties": {myColor: HirParkCol, title: "Hiroshima Peace Memorial Park", description: "Established April 1, 1954." },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            132.44857549667358,
            34.39155926825359
          ],
          [
            132.44961619377136,
            34.391337932952965
          ],
          [
            132.4494767189026,
            34.39113430395948
          ],
          [
            132.45237350463867,
            34.39035519715012
          ],
          [
            132.4524164199829,
            34.39063850955618
          ],
          [
            132.45418667793274,
            34.390125005114164
          ],
          [
            132.4547982215881,
            34.39178060296896
          ],
          [
            132.45494842529297,
            34.393020066559295
          ],
          [
            132.4549376964569,
            34.39313515867569
          ],
          [
            132.45399355888364,
            34.39473757862432
          ],
          [
            132.4544334411621,
            34.39590617493213
          ],
          [
            132.45321035385132,
            34.396269144706565
          ],
          [
            132.45315670967102,
            34.396154056899746
          ],
          [
            132.45176196098328,
            34.39648161408796
          ],
          [
            132.45028138160706,
            34.39433918978991
          ],
          [
            132.45008826255798,
            34.393949652207155
          ],
          [
            132.4498736858368,
            34.393657497830326
          ],
          [
            132.4494767189026,
            34.3930731860173
          ],
          [
            132.44857549667358,
            34.39155926825359
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
      "properties": {myColor: NagParkCol, title: "Nagasaki Peace Park: Wish Zone", description: "Established April 1, 1955. "},
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
    "properties": {myColor: NagParkCol, title: "Nagasaki Peace Park: Prayer Zone", description: "Includes the Peace Symbols Zone which is made up of donated monuments. "},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            129.86355364322662,
            32.774235751420164
          ],
          [
            129.86256122589108,
            32.77375764170362
          ],
          [
            129.86289381980896,
            32.7721067902952
          ],
          [
            129.86306011676788,
            32.7721744487416
          ],
          [
            129.86323177814484,
            32.772138364243254
          ],
          [
            129.8632854223251,
            32.77219700154563
          ],
          [
            129.8632425069809,
            32.77245861365479
          ],
          [
            129.86327469348907,
            32.77246312420164
          ],
          [
            129.86325860023499,
            32.772517250746155
          ],
          [
            129.8633712530136,
            32.77253078237714
          ],
          [
            129.86341953277588,
            32.77240899762421
          ],
          [
            129.86374139785767,
            32.77248116638681
          ],
          [
            129.86402034759521,
            32.772305254925456
          ],
          [
            129.86406862735748,
            32.773559180312155
          ],
          [
            129.8636394739151,
            32.773559180312155
          ],
          [
            129.8636072874069,
            32.773753131222364
          ],
          [
            129.86351609230042,
            32.774010228288994
          ],
          [
            129.86355364322662,
            32.774235751420164
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {myColor: NagParkCol, title: "Nagasaki Peace Park: Learning Zone", description: "With the goal to educate for generations to come, the history of the atomic bombing of Nagsaki and the dangers of nuclear weapons."},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            129.86411154270172,
            32.77314421415447
          ],
          [
            129.8640739917755,
            32.772309765480095
          ],
          [
            129.86429929733276,
            32.771863219462325
          ],
          [
            129.8646479845047,
            32.77189930407222
          ],
          [
            129.86550629138947,
            32.771836155995324
          ],
          [
            129.8653346300125,
            32.773184808755275
          ],
          [
            129.8647177219391,
            32.77320285079414
          ],
          [
            129.86462116241455,
            32.77311715107697
          ],
          [
            129.86411154270172,
            32.77314421415447
          ]
        ]
      ]
    }
  }
]    
};
let parks = processJSONLayer(parksData)


////////////////////////////////////////////////////////
// MAP DATA PART 3: DIRECT CREATION OF SHAPE OVERLAYS //
////////////////////////////////////////////////////////


// Hogwarts Buildings Objects and LayerGroup
// API docs: https://leafletjs.com/reference-1.5.0.html#polygon
//  (keep scrolling for docs on rectangles and circles)

let hiroshimahypo = L.circle([ 34.39464724174592, 132.45479192752794 ], {
    color: 'rgb(155, 102, 102)',
    opacity: 1,
    weight: 3,
    fillColor: HirCol,
    fillOpacity: 0.10,
    title: 'Hiroshima\'s Hypocenter',
    windowContent: `<h3>Hiroshima\'s Hypocenter</h3><p>Location of impact</p3>`
});

let nagasakihypo = L.circle([ 32.77373031623168, 129.86322281575983 ], {
  color: 'rgb(155, 102, 102)',
  opacity: 1,
  weight: 3,
  fillColor: NagCol,
  fillOpacity: 0.10,
  title: 'Nagasaki\'s Hypocenter',
  windowContent: `<h3>Nagasaki Hypocenter</h3><p>Location of Impact</p3>`
});


//let motoyasu = L.polygon([34.39409572901314, 132.45341151952744],[34.39409572901314, 132.4534222483635],
  //  [ 34.394100155579046, 132.4534222483635],[34.394100155579046, 132.45341151952744],[34.39409572901314, 132.45341151952744], {
    //color: towerCol,
   // opacity: 0.8,
    //weight: 2,
   // fillColor: towerCol,
    //fillOpacity: 0.35,
    //radius: 40,
    //title: 'Motoyasu Bridge',
   // windowContent: `<h3></p>`
//});

let hypocenters = processManualLayers([nagasakihypo, hiroshimahypo],
                                 {description: 'Hypocenters'});




// Polyline Objects and Layer Group ("paths")
let hirPath = L.polyline( [
  [
    34.391506147834804,
    132.45197653770447
  ],
  [
    34.391532708048416,
    132.4531352519989
  ],
  [
    34.39182486984179,
    132.45211601257324
  ],
  [
    34.39281644165799,
    132.45251297950745
  ],
  [
    34.39310859897056,
    132.45319962501526
  ],
  [
    34.39395850535416,
    132.45309233665466
  ],
  [
    34.39423295244714,
    132.45402574539185
  ],
  [
    34.39504743529558,
    132.4537467956543
  ]
], {
                                    color: 'blue',
                                    weight: 6,
                                    title: 'Path along the Hiroshima Memorial',
                                    windowContent: `<h3>A Possible Path</h3><p>Starting from the south of the park, moving towards the A-bomb Dome.</p>`})


let nagasakiPath = L.polyline([
  [
    32.77451990975169,
    129.8624002933502
  ],
  [
    32.77530472328714,
    129.86299574375153
  ],
  [
    32.77549416000011,
    129.86288309097287
  ],
  [
    32.77670293714836,
    129.86377894878387
  ],
  [
    32.7755257327464,
    129.863623380661
  ],
  [
    32.77587754259007,
    129.86404716968536
  ],
  [
    32.77578282469204,
    129.86414909362793
  ],
  [
    32.77536786890293,
    129.86384332180023
  ],
  [
    32.77457854548496,
    129.86368238925934
  ],
  [
    32.77448833664857,
    129.86355900764465
  ],
  [
    32.77379372554542,
    129.86346781253815
  ],
  [
    32.77365841106322,
    129.86304938793182
  ],
  [
    32.77288711458601,
    129.86326932907104
  ],
  [
    32.772760819789134,
    129.86341953277588
  ],
  [
    32.772733756595045,
    129.86400425434113
  ],
  [
    32.77274728819311,
    129.86498057842255
  ],
  [
    32.772097769165136,
    129.8650074005127
  ]
]
, {
                                    color: 'blue',
                                    weight: 6,
                                    title: 'Path along the Nagasaki Memorial',
                                    windowContent: `<h3>A Possible Path</h3><p>Passing through the Wish Zone, Prayer Zone, and Learning Zone.</p>`})

//let horcruxPath = L.polyline([[55.49058639152367,-1.5951092937469482],
                              //[55.61679475360749,-1.6392910480499268]], {
                                  //color: NagCol,
                                  //weight: 4,
                                  //title: 'Return from Horcrux quest',
                                  //windowContent: `<h3>Return Disapparation from Failed Horcrux quest</h3><p>Exhaisted and grieviously injured, Dumbledore returns to find the trap he had so long expected has been sprung.</p>`})
let paths = processManualLayers([hirPath, nagasakiPath], {description: 'Paths'})


////////////////////////////////////////////////
// array of all the layers!!!!!!!
// these layers will be added to the map
// you should change these variable names
// to align with the variables you've defiend above
let allLayers = [nagasakiMarkers, hiroshimaMarkers, parks, hypocenters, paths];


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
        id: 'mapbox/satellite-v9',
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
