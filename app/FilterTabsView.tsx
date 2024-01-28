'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { labelsToQuery } from '../lib/label';

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
        filters.map(({labels}, n) => {
          const q = labelsToQuery(labels);
          return (
            <span className='filter-tab' key={n}>
              <Link key={labels} href={`/?q=${q}`}>
                {
                  labels.map((l, n) => (
                    <span key={n}>{l.k}:{l.v}</span>
                  ))
                }
              </Link>
            </span>
          )
        })
      }
    </>
  );
}
