'use client'

import { useState, useEffect } from 'react';


export default function FilterTabsView() {
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    fetch('/api/filters').then(r => r.json()).then((results) => {
      setFilters(results);
    });
  }, []);

  return (
    <>
      {
        filters.map(({labels}) => (
            <p key={labels}>
              {
                labels.map((l, n) => (
                  <span key={n}>{l.k}:{l.v}</span>
                ))
              }
            </p>
        ))
      }
    </>
  );
}
