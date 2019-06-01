
function Filter(filter, callback) {
  if (filter) {
    var type = filter[0]
    if (ops[type] !== undefined) {
      operatorFilter(filter, function(err, result) {
        callback(null, result)
      })
    } else if (type == 'in' || type == '!in') {
      membershipFilter(filter, function(err, result) {
        callback(null, result)
      })
    } else if (type == 'all' || type == 'any' || type == 'none') {
      combiningFilter(filter, function(err, result) {
        callback(null, result)
      })
    }
    else{
      callback(null,'');
    }
  }
  else{
    //console.log("there is no filter")
    callback(null,'');
  }
}

var ops = {
  '<': "&lt; ",
  '>': "&gt; ",
  '==': " = ",
  '!=': " != ",
  '<=': "&lt;= ",
  '>=': "&gt;= "
}

const getExpressionStr = (key, op, value) => {
  const fieldName = '\[' + key + '\]';
  if (key == "class" && value == "\"trunk\"") {
    return `[highway]${op}'trunk_link' or [highway]${op}'trunk'`;
  }
  if (key == "structure" && value == "\"bridge\"") {
    return `[bridge]${op}'yes'`;
  }
  if (key == "structure" && value == "\"tunnel\"") {
    return `[tunnel]${op}'yes'`;
  }
  if (["type", "class"].includes(key) && value == "\"tertiary\"") {
    return `[highway]${op}'tertiary_link' or [highway]${op}'tertiary'`;
  }
  if (["type", "class"].includes(key) && value == "\"secondary\"") {
    return `[highway]${op}'secondary_link' or [highway]${op}'secondary'`;
  }
  if (["type", "class"].includes(key) && value == "\"primary\"") {
    return `[highway]${op}'primary_link' or [highway]${op}'primary'`;
  }
  if (["type", "class"].includes(key) && value == "\"motorway\"") {
    return `[highway]${op}'motorway_link' or [highway]${op}'motorway'`;
  }
  if (["type", "class"].includes(key) && value == "\"motorway_link\"") {
    return `[highway]${op}'motorway_link'`;
  }
  if (["type", "class"].includes(key) && value == "\"trunk_link\"") {
    return `[highway]${op}'trunk_link'`;
  }
  if (key == "class" && value == "\"street\"") {
    return `[highway]${op}'residential' or [highway]${op}'unclassified'`;
  }
  if (key == "class" && value == "\"street_limited\"") {
    return `[highway]${op}'residential'`;
  }
  if (key == "type" && value == "\"taxiway\"") {
    return `[aeroway]${op}'taxiway'`;
  }
  if (key == "type" && value == "\"runway\"") {
    return `[aeroway]${op}'runway'`;
  }
  return '';
  // return true;
  // return fieldName + op + value;
}

//Comparison Filters(> , < , = , >= , <=)
function operatorFilter(filter, callback) {
  var xml_filter = ''
  var op = ops[filter[0]]
  if (op) {
    const key = getKey(filter[1]);
    const value = getValue(key, filter[2]);
    xml_filter = getExpressionStr(key, ops[filter[0]], value);
  } else {
    callback("Filter Error:" + "No Match operator!!!")
  }
  if (xml_filter) xml_filter = '\( ' + xml_filter + ' \)'
  callback(null, xml_filter)
}

//Set Membership Filters(in , !in)
function membershipFilter(filter, callback) {
  var xml_filter = ''
  var key = getKey(filter[1]);
  var count = 0
  if (filter[0] == 'in') {
    for(var i=2;i<filter.length;i++){
      var val = getValue(key, filter[i]);
      if (xml_filter.trim().length > 0) {
        xml_filter += ' or ' + getExpressionStr(key, ' = ', val);
      } else {
        xml_filter += getExpressionStr(key, ' = ', val);
      }
      count++
      if (count >= filter.length-2) {
        if (xml_filter) xml_filter = '\( ' + xml_filter + ' \)'
        callback(null, xml_filter)
      }
    }

  }
  else if (filter[0] == '!in') {
    for(var i=2;i<filter.length;i++){
      var val = getValue(key, filter[i]);
      if (xml_filter.trim().length > 0) {
        xml_filter += ' and ' + getExpressionStr(key, ' != ', val);
      } else {
        xml_filter += getExpressionStr(key, ' != ', val);
      }
      count++
      if (count >= filter.length-2) {
        if (xml_filter) xml_filter = '\( ' + xml_filter + ' \)'
        callback(null, xml_filter)
      }
    }
  }
}

function combiningFilter(filter, callback) {
  //console.log(filter);
  var xml_filter = ''
  var type = filter[0]
  if(type.toLowerCase()=='all'&&filter.length==1){
    callback(null,'');
  }
else{
  if (type === 'all') {
    var link_word = ' and '
  } else if (type === 'any') {
    var link_word = ' or '
  } else if (type === 'none') {
    var link_word = ' not'
  }
  //filter.splice(0, 1)
  filter.forEach(function(e) {
    if (e instanceof Array) {
      var str;
      Filter(e, function(err, result) {
        if(result.trim().length>0){
          str = result
          if (type === 'none') {
            str = link_word + str
          } else if (type !== 'none' && (xml_filter.trim().length > 0)) {
            str = link_word + str
          }
          xml_filter += str
        }
      })
    }
  })
  // console.log(xml_filter);
    if(xml_filter.trim().length==0){
      callback(null, "");
    }
    else{
    callback(null, "\("+xml_filter+"\)")
    }
  }
}

function getKey(k) {
  if (k == '$type') {
    return 'mapnik::geometry_type'
  } else {
    return k
  }
}

function getValue(k,v) {
  if(k=='$type'||k=='mapnik::geometry_type'){
    return v.toLowerCase();
  }
  if (typeof v == 'string') {
    return '"' + v + '"'
  } else {
    return v
  }
}


exports.Filter = Filter
