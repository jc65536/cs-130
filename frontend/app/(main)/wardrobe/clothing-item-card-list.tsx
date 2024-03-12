import React from 'react';
import ClothingItemCard, { Clothing } from './clothing-item-card';
import '@/app/card.css';

// Dummy data for demonstration
var clothings: Clothing[] = [];
for (let id = 1; id <= 20; id++) {
    clothings.push({ id, name: `Caption ${id}`, rating: 5 });
}


export default function ClothingItemCardList() {
  return (
    <div className="clothing-list">
      {clothings.map((clothing, i) => (
        // Assuming PostItemCard accepts props for id and caption
        <ClothingItemCard key={i} id={clothing.id} name={clothing.name} rating={clothing.rating} />
      ))}
    </div>
  );
}
