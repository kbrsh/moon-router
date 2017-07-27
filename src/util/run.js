const run = (instance, path) => {
  // Change Current Component and Build
  const parts = path.slice(1).split("/");
  let currentMapState = instance.map;
  let context = {
    query: {},
    params: {}
  }

  for(let i = 0; i < parts.length; i++) {
    let part = parts[i];

    // Query Parameters
    if(part.indexOf("?") !== -1) {
      const splitQuery = part.split("?");
      part = splitQuery.shift();

      for(let j = 0; j < splitQuery.length; j++) {
        const keyVal = splitQuery[j].split('=');
        context.query[keyVal[0]] = keyVal[1];
      }
    }

    if(currentMapState[part] === undefined) {
      if(currentMapState["*"]) {
        // Wildcard
        part = "*";
      } else if(currentMapState[":"]) {
        // Named Parameters
        context.params[currentMapState[":"].name] = part;
        part = ":";
      }
    }

    // Move through State
    currentMapState = currentMapState[part];

    // Path Not In Map
    if(currentMapState === undefined) {
      run(instance, instance.default);
      return false;
    }
  }

  // Handler not in Map
  if(currentMapState['@'] === undefined) {
    run(instance, instance.default);
    return false;
  }

  instance.current = {
    path: path,
    component: currentMapState['@']
  };

  // Setup Route Context
  instance.route = context;

  // Build Moon Instance
  if(instance.instance !== null) {
    instance.instance.build();
  }

  return true;
}
