var path = require('path')
var xmlbuilder = require('xmlbuilder')
var trans = require('./lib/Translate')
var style = require('./lib/style')
var parameter = require('./lib/Parameters')
var uti=require('./lib/uti')


var srs_mector = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 \
+x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over"


var Map = function(srs, layer,markerUri) {
  var obj = {
    Map: {
      //'@srs': srs || srs_mector,
      Parameters: {},
      Style: [],
      Layer: []
    }
  }
  var bj = trans.bgTranslate(layer,markerUri)
  for (var p in bj) {
    obj.Map[p] = bj[p]
  }

  return obj
}


function Style(layer, markerUri, callback) {
  style.getStyle(layer, markerUri, function(err, data) {
    if(err){
      callback(err);
    }
    if(data.length===0){
      callback(null, {});
    }
    if (layer.id == "water") {
      var style1 = {
        '@name': "water",
        'Rule': data
      }
    } else {
      var style1 = {
        '@name': layer.id,
        'Rule': data
      }
    }
    callback(null, style1)
  })
}

function Layer(glayers) {
  var mlayers = []
  glayers.forEach(function(e) {
    if (e.type !== 'background') {
      var layer = {
        '@srs': srs_mector,
        '@name': e['source-layer'],
        'StyleName': e.id
      }
      mlayers.push(layer)
    }
  })
  return mlayers
}


function gl2xml(globj, callback) {
  const zoom = globj.zoom;
  var fontUri, markerUri
  var source_obj=globj.sources;
  if (globj.glyphs) {
    var font_url = globj.glyphs
    var start = font_url.indexOf('\/fonts')
    var str = font_url.slice(start, font_url.length)
    var arr = str.split('/')
    fontUri = path.resolve(path.join(arr[1], arr[2]))
  } else {
    fontUri = null
  }

  if (globj.sprite) {
    var marker_url = globj.sprite
    var start2 = marker_url.indexOf('\/sprites')
    var str2 = marker_url.slice(start, marker_url.length)
    var arr2 = str2.split('/')
    markerUri = path.resolve(path.join(arr2[1], arr2[2],arr2[3]))
  } else {
    markerUri = null
  }

  var shield_array=(globj.metadata&&globj.metadata.shield)?globj.metadata.shield:[];
  var autolabel_array=(globj.metadata&&globj.metadata.autolabel)?globj.metadata.autolabel:[];

  var mMap = {}
  var glayers = globj.layers
  var para = parameter.getParameters(globj)

  mMap = Map(srs_mector, glayers,markerUri)
  // if (fontUri) {
  //   mMap.Map['@font-directory'] =fontUri.replace(/\\/g,'\/')
  // }
  // mMap.Map.Layer = Layer(glayers)
  mMap.Map.Style = [
    {'@name': "road", Rule: []},
    {'@name': "water", Rule: []},
    {'@name': "ocean", Rule: []},
    {'@name': "aeroway", Rule: []},
  ]
  // mMap.Map.Parameters = para.Parameters
  glayers.forEach(function(e) {
    if (e.type !== 'background'&&source_obj[e.source].type!=='video') {
      if(uti.contains(shield_array,e.id)){
        e.shield=true;
      }
      if(uti.contains(autolabel_array,e.id)){
        e.autolabel=true;
      }
      Style(e, markerUri, function(err, data) {
        if(err){console.log(err);callback(err);}
        if (uti.isEmptyObject(data)) return;
        var relevantRule = data.Rule.find((rule) => {
          return (!rule.MaxScaleDenominator || rule.MaxScaleDenominator >= ranges[zoom]) &&
          (!rule.MinScaleDenominator || rule.MinScaleDenominator <= ranges[zoom])
        });
        if (!relevantRule) return;
        // if (!relevantRule.Filter && e.filter) return;
        delete relevantRule.MaxScaleDenominator;
        delete relevantRule.MinScaleDenominator;
        if (e["source-layer"] == "water" || e["source-layer"] == "waterway") {
          // ocean
          const ruleCopy = Object.assign({}, relevantRule);
          delete ruleCopy.Filter;
          mMap.Map.Style[2].Rule.push(ruleCopy);
          // freshwater
          mMap.Map.Style[1].Rule.push(relevantRule);
        } else if (e["source-layer"] == "road") {
          mMap.Map.Style[0].Rule.push(relevantRule);
        } else if (e["source-layer"] == "aeroway") {
          mMap.Map.Style[3].Rule.push(relevantRule);
        }
      })
    }
  })
  delete mMap.Map.Parameters;
  delete mMap.Map.Layer;
  var xml = xmlbuilder.create(mMap).dec('1.0', 'UTF-8').end().replace(/&amp;/g,'&');
  callback(null, xml)
}

var ranges = {
    0: 2000000000,
    1: 1000000000,
    2: 500000000,
    3: 200000000,
    4: 100000000,
    5: 50000000,
    6: 25000000,
    7: 12500000,
    8: 6500000,
    9: 3000000,
    10: 1500000,
    11: 750000,
    12: 400000,
    13: 200000,
    14: 100000,
    15: 50000,
    16: 25000,
    17: 12500,
    18: 5000,
    19: 2500,
    20: 1500,
    21: 750,
    22: 500,
    23: 250,
    24: 100
};

module.exports = gl2xml
