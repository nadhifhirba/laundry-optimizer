export type LaundryStatus = 'open' | 'busy' | 'full';

export interface Laundry {
  id: string;
  name: string;
  address: string;
  capacity_kg: number;
  current_load_kg: number;
  price_per_kg: number;
  rating: number;
  open_hours: string;
  status: LaundryStatus;
  lat: number;
  lng: number;
}

export const seedLaundries: Laundry[] = [
  {
    id: 'kilo-kilat-kemang',
    name: 'Kilo Kilat Kemang',
    address: 'Jl. Kemang Raya No. 21, Bangka, Mampang Prapatan, Jakarta Selatan',
    capacity_kg: 120,
    current_load_kg: 42,
    price_per_kg: 9000,
    rating: 4.8,
    open_hours: '07.00 - 21.00',
    status: 'busy',
    lat: -6.2631,
    lng: 106.8142,
  },
  {
    id: 'bersih-cepat-kuningan',
    name: 'Bersih Cepat Kuningan',
    address: 'Jl. HR Rasuna Said Kav. 62, Kuningan, Setiabudi, Jakarta Selatan',
    capacity_kg: 150,
    current_load_kg: 110,
    price_per_kg: 10000,
    rating: 4.7,
    open_hours: '06.30 - 22.00',
    status: 'busy',
    lat: -6.2244,
    lng: 106.8307,
  },
  {
    id: 'freshfold-tebet',
    name: 'FreshFold Tebet',
    address: 'Jl. Tebet Barat Dalam I No. 14, Tebet Barat, Jakarta Selatan',
    capacity_kg: 90,
    current_load_kg: 25,
    price_per_kg: 8500,
    rating: 4.6,
    open_hours: '07.00 - 20.30',
    status: 'open',
    lat: -6.2388,
    lng: 106.8495,
  },
  {
    id: 'cuci-cepat-menteng',
    name: 'Cuci Cepat Menteng',
    address: 'Jl. Cikini Raya No. 11, Menteng, Jakarta Pusat',
    capacity_kg: 75,
    current_load_kg: 72,
    price_per_kg: 11000,
    rating: 4.9,
    open_hours: '08.00 - 21.30',
    status: 'full',
    lat: -6.1937,
    lng: 106.8417,
  },
  {
    id: 'nova-senayan',
    name: 'Nova Laundry Senayan',
    address: 'Jl. Asia Afrika No. 8, Gelora, Tanah Abang, Jakarta Pusat',
    capacity_kg: 180,
    current_load_kg: 63,
    price_per_kg: 10500,
    rating: 4.5,
    open_hours: '06.00 - 23.00',
    status: 'open',
    lat: -6.2252,
    lng: 106.7979,
  },
  {
    id: 'kilopro-rawamangun',
    name: 'KiloPro Rawamangun',
    address: 'Jl. Balai Pustaka Timur No. 7, Rawamangun, Jakarta Timur',
    capacity_kg: 130,
    current_load_kg: 96,
    price_per_kg: 8000,
    rating: 4.4,
    open_hours: '07.00 - 21.00',
    status: 'busy',
    lat: -6.1993,
    lng: 106.8884,
  },
  {
    id: 'lintas-bersih-pluit',
    name: 'Lintas Bersih Pluit',
    address: 'Jl. Pluit Karang Utara No. 39, Penjaringan, Jakarta Utara',
    capacity_kg: 100,
    current_load_kg: 48,
    price_per_kg: 9500,
    rating: 4.3,
    open_hours: '07.30 - 20.00',
    status: 'open',
    lat: -6.1269,
    lng: 106.8008,
  },
  {
    id: 'oasis-cuci-cipete',
    name: 'Oasis Cuci Cipete',
    address: 'Jl. Cipete Raya No. 63, Cipete Selatan, Jakarta Selatan',
    capacity_kg: 110,
    current_load_kg: 88,
    price_per_kg: 9200,
    rating: 4.7,
    open_hours: '07.00 - 22.00',
    status: 'busy',
    lat: -6.2864,
    lng: 106.7946,
  },
];
