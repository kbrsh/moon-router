const defineProperty = function(obj, prop, value, def) {
  if(value === undefined) {
    obj[prop] = def;
  } else {
    obj[prop] = value;
  }
}
