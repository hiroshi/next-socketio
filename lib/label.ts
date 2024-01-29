function queryToLabels(queryString) {
  return queryString.split(/\s+/).map((l) => {
    const n = l[0] === '-';
    const label = n ? l.slice(1) : l;
    const [k, v] = label.split(':');
    return n ? {k, v, n} : {k, v};
  });
}

function labelsToQuery(labels) {
  return labels.map(({k, v, n}) => {
    return n ? `-${k}:${v}` : `${k}:${v}`;
  }).join(' ');
}

export { queryToLabels, labelsToQuery };
