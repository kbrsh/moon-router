const map = (routes) => {
  let routesMap = {};

  for(let route in routes) {
    let currentMapState = routesMap;

    // Split up by parts
    const parts = route.substring(1).split("/");
    for(let i = 0; i < parts.length; i++) {
      let part = parts[i];

      // Found named parameter
      if(part[0] === ":") {
        let param = currentMapState[namedParameterAlias];
        if(param === undefined) {
          currentMapState[namedParameterAlias] = {
            name: part.substring(1)
          };
        } else {
          param.name = part.substring(1);
        }

        currentMapState = currentMapState[namedParameterAlias];
      } else {
        // Add part to map
        if(currentMapState[part] === undefined) {
            currentMapState[part] = {};
        }

        currentMapState = currentMapState[part];
      }
    }

    // Add component
    currentMapState["@"] = routes[route];
  }

  return routesMap;
}
