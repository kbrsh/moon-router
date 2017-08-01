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
    if(part.indexOf(queryAlias) !== -1) {
      const splitQuery = part.split(queryAlias);
      part = splitQuery.shift();

      for(let j = 0; j < splitQuery.length; j++) {
        const keyVal = splitQuery[j].split('=');
        context.query[keyVal[0]] = keyVal[1];
      }
    }

    if(currentMapState[part] === undefined) {
      let namedParameter = null;

      if(currentMapState[wildcardAlias] !== undefined) {
        // Wildcard
        part = wildcardAlias;
      } else if((namedParameter = currentMapState[namedParameterAlias]) !== undefined) {
        // Named Parameters
        context.params[namedParameter.name] = part;
        part = namedParameterAlias;
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
  if(currentMapState[componentAlias] === undefined) {
    run(instance, instance.default);
    return false;
  }

  // Setup current information
  instance.current = {
    path: path,
    component: currentMapState[componentAlias]
  };

  // Setup Route Context
  instance.route = context;

  // Build Moon Instance
  if(instance.instance !== null) {
    instance.instance.build();
  }

  return true;
}
