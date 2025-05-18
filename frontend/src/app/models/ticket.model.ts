export interface Ticket {
  _id: string;
  event: {
    _id: string;
    title: string;
    date: Date;
    location: string;
  };
  category: any; // Lehet string vagy objektum is (name, price mezőkkel)
  price?: number; // Ha közvetlenül a jegyhez csatolva van
  purchaseDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled'; // A backend adatbázis sémában ezek a lehetséges értékek
  userId: string;
}