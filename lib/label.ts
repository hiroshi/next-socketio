function queryToLabels(queryString) {
  return queryString.split(/\s+/).map((pair) => {
    const [k, v] = pair.split(':');
    return {k, v};
  });
}

function labelsToQuery(labels) {
  return labels.map(({k,v}) => `${k}:${v}`).join(' ')
}

export { queryToLabels, labelsToQuery };
