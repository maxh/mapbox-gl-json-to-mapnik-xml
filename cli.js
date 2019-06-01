
var gl2xml = require('./index')

var fs = require('fs');
fs. readFile('./style_2.json', 'utf8', function(err, contents) {
  var json = JSON.parse(contents);
  gl2xml(json, (error, result)=>console.log(result));
});

// var {getStyle} = require('./lib/style')

// var xmlbuilder = require('xmlbuilder')

// const layer =         {
//             "id": "road-pedestrian-case",
//             "type": "line",
//             "metadata": {"mapbox:group": "0cb8c63458cbe21bbe1ad66543f73a04"},
//             "source": "composite",
//             "source-layer": "road",
//             "minzoom": 16,
//             "filter": [
//                 "all",
//                 ["==", "$type", "LineString"],
//                 [
//                     "all",
//                     ["==", "class", "pedestrian"],
//                     ["==", "structure", "none"]
//                 ]
//             ],
//             "layout": {"line-join": "round", "visibility": "visible"},
//             "paint": {
//                 "line-width": {"base": 1.5, "stops": [[14, 2], [18, 14.5]]},
//                 "line-opacity": {"base": 1, "stops": [[13, 0], [16, 1]]}
//             }
//         };

// getStyle(layer, "", (err, result) => {
//   console.log(result);
//   var xml = xmlbuilder.create(result).dec('1.0', 'UTF-8').end().replace(/&amp;/g,'&');
//   console.log(xml);
// });


/*

(( [type] != "apron" ) and ( [mapnik::geometry_type] = polygon ))
(( [mapnik::geometry_type] = linestring ) and ( [type] = "runway" ))
(( [mapnik::geometry_type] = linestring ) and ( [type] = "taxiway" ))
(( [mapnik::geometry_type] = linestring ) and (( [structure] = "none" ) and ( [class] = "street" or [class] = "street_limited" )))
(( [structure] != "bridge" and [structure] != "tunnel" ) and ( [class] = "secondary" or [class] = "tertiary" ))
(( [structure] != "bridge" and [structure] != "tunnel" ) and ( [class] = "primary" ))
(( [structure] != "bridge" and [structure] != "tunnel" ) and ( [class] = "motorway_link" ))
(( [structure] != "bridge" and [structure] != "tunnel" ) and ( [type] = "trunk_link" ))
(( [structure] != "bridge" and [structure] != "tunnel" ) and ( [class] = "trunk" ))
(( [structure] != "bridge" and [structure] != "tunnel" ) and ( [class] = "motorway" ))
(( [structure] != "bridge" and [structure] != "tunnel" ) and ( [type] = "trunk_link" ))
(( [structure] != "bridge" and [structure] != "tunnel" ) and ( [class] = "motorway_link" ))
(( [mapnik::geometry_type] = linestring ) and (( [structure] = "none" ) and ( [class] = "street" or [class] = "street_limited" )))
(( [structure] != "bridge" and [structure] != "tunnel" ) and ( [class] = "secondary" or [class] = "tertiary" ))
(( [structure] != "bridge" and [structure] != "tunnel" ) and ( [class] = "primary" ))
(( [structure] != "bridge" and [structure] != "tunnel" ) and ( [class] = "trunk" ))
(( [structure] != "bridge" and [structure] != "tunnel" ) and ( [class] = "motorway" ))
(( [structure] = "bridge" ) and ( [class] = "street" or [class] = "street_limited" ))
(( [structure] = "bridge" ) and ( [class] = "secondary" or [class] = "tertiary" ))
(( [class] = "primary" ) and ( [structure] = "bridge" ))
(( [class] = "trunk" ) and ( [structure] = "bridge" ))
(( [class] = "motorway" ) and ( [structure] = "bridge" ))
(( [structure] = "bridge" ) and ( [class] = "street" or [class] = "street_limited" ))
(( [structure] = "bridge" ) and ( [type] = "secondary" or [type] = "tertiary" ))
(( [structure] = "bridge" ) and ( [type] = "primary" ))
(( [layer] != 2 and [layer] != 3 and [layer] != 4 and [layer] != 5 ) and ( [class] = "trunk" ) and ( [structure] = "bridge" ))
(( [layer]&lt; 2 ) and ( [class] = "motorway" ) and ( [structure] = "bridge" ))
(( [class] = "trunk" ) and ( [structure] = "bridge" ) and ( [layer]&gt;= 2 ))
(( [class] = "motorway" ) and ( [structure] = "bridge" ) and ( [layer]&gt;= 2 ))

(( [class] = "trunk" ) and ( [structure] = "bridge" ) and ( [layer]&gt;= 2 ))
([highway]='trunk_link' or [highway]='trunk') and [bridge]='yes'
*/
