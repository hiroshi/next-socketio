'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { labelsToQuery } from './label';

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
        filters.map(({labels}) => {
          const q = labelsToQuery(labels);
          return (
            <Link key={labels} href={`/?q=${q}`}>
              {
                labels.map((l, n) => (
                  <span key={n}>{l.k}:{l.v}</span>
                ))
              }
            </Link>
          )
        })
      }
    </>
  );
}
