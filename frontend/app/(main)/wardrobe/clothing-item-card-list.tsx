"use client";

import React, { useState, useEffect } from 'react';
import ClothingItemCard, { Clothing } from './clothing-item-card';
import '@/app/card.css';
import { useHostContext } from '@/app/components/host-context';

// Dummy data for demonstration
// var clothings: Clothing[] = [];
// for (let id = 1; id <= 20; id++) {
//     clothings.push({ id, name: `Caption ${id}`, rating: 5 });
// }


export default function ClothingItemCardList() {
  const backend_url = useHostContext();
  const [clothings, setClothing] = useState<Clothing[]>([]);

  useEffect(() => {
    fetch(backend_url(`/wardrobe/clothes`), { credentials: "include" })
      .then(res => res.json())
      .then(setClothing);
  }, []);

  return (
    <div className="clothing-list">
      {clothings.map((clothing, i) => (
        <ClothingItemCard key={i} {...clothing} />
      ))}
    </div>
  );
}
