type queryToLabelsOptions = {
  ignoreNegative: bool,
};

function queryToLabels(queryString, options: queryToLabelsOptions = {}) {
  const labels = queryString.split(/\s+/).map((l) => {
    const n = l[0] === '-';
    const label = n ? l.slice(1) : l;
    const [k, v] = label.split(':');
    return n ? {k, v, n} : {k, v};
  }).filter(l => l.k && l.v);

  return options.ignoreNegative ? labels.filter(l => !l.n) : labels;
}

function labelsToQuery(labels) {
  return labels.map(({k, v, n}) => {
    return n ? `-${k}:${v}` : `${k}:${v}`;
  }).join(' ');
}

export { queryToLabels, labelsToQuery };
