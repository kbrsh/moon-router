const map = (routes) => {
  let routesMap = {};

  for(let route in routes) {
    let currentMapState = routesMap;

    // Split up by Parts
    const parts = route.slice(1).split("/");
    for(let i = 0; i < parts.length; i++) {
      let part = parts[i];

      // Found Named Parameter
      if(part[0] === ":") {
        let param = currentMapState[namedParameterAlias];
        if(param === undefined) {
          currentMapState[namedParameterAlias] = {
            name: part.slice(1)
          };
        } else {
          param.name = part.slice(1);
        }

        currentMapState = currentMapState[namedParameterAlias];
      } else {
        // Add Part to Map
        if(currentMapState[part] === undefined) {
            currentMapState[part] = {};
        }

        currentMapState = currentMapState[part];
      }
    }

    // Add Component
    currentMapState["@"] = routes[route];
  }

  return routesMap;
}
