const run = (instance, path) => {
  // Change Current Component and Build
  const parts = path.slice(1).split("/");
  let currentMapState = instance.map;
  let context = {
    query: {},
    params: {}
  }

  for(var i = 0; i < parts.length; i++) {
    let part = parts[i];

    // Query Parameters
    if(part.indexOf("?") !== -1) {
      const splitQuery = part.split("?");
      part = splitQuery.shift();

      for(var j = 0; j < splitQuery.length; j++) {
        const keyVal = splitQuery[j].split('=');
        context.query[keyVal[0]] = keyVal[1];
      }
    }

    // Wildcard
    if(currentMapState["*"]) {
      part = "*";
    }

    // Named Parameters
    if(currentMapState[":"]) {
      const paramName = currentMapState[":"];
      context.params[paramName] = part;
      part = `:${paramName}`;
    }

    // Move through State
    currentMapState = currentMapState[part];

    // Path Not In Map
    if(!currentMapState) {
      run(instance, instance.default);
      return false;
    }
  }

  // Handler not in Map
  if(!currentMapState['@']) {
    run(instance, instance.default);
    return false;
  }

  instance.current = {
    path: path,
    component: currentMapState['@']
  };

  if(instance.instance) {
    instance.instance.$data.route = context;
    instance.instance.build();
  }

  return true;
}
