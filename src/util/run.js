import {wildcardAlias, queryAlias, namedParameterAlias, componentAlias} from "./constants.js";

export const run = (instance, path) => {
  // Change current component and build
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
      let namedParameter = currentMapState[namedParameterAlias];

      if(namedParameter !== undefined) {
        // Named Parameter
        context.params[namedParameter.name] = part;
        part = namedParameterAlias;
      } else if(currentMapState[wildcardAlias] !== undefined) {
        // Wildcard
        part = wildcardAlias;
      }
    }

    // Move through state
    currentMapState = currentMapState[part];

    // Path not in map
    if(currentMapState === undefined) {
      run(instance, instance.default);
      return false;
    }
  }

  // Handler not in map
  if(currentMapState[componentAlias] === undefined) {
    run(instance, instance.default);
    return false;
  }

  // Setup current information
  instance.current = path;

  // Setup Route Context
  instance.route = context;

  // Build Instance
  instance.instance.build();

  // Build components
  const component = currentMapState[componentAlias];
  const components = instance.components;
  for(let i = 0; i < components.length; i++) {
    components[i].set("component", component);
  }

  return true;
}
