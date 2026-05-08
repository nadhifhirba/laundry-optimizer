'use client';

import Link from 'next/link';
import { ArrowRight, Clock3, MapPin, Star, Sparkles, Filter, Bike } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLaundryStore } from '@/lib/store';
import { type Laundry } from '@/lib/seed';

const userLocation = { lat: -6.2088, lng: 106.8456 };

type SortKey = 'distance' | 'price' | 'rating';
type StatusFilter = 'all' | 'open' | 'busy' | 'full';

const statusMeta: Record<Laundry['status'], { label: string; className: string }> = {
  open: { label: 'Available', className: 'open' },
  busy: { label: 'Busy', className: 'busy' },
  full: { label: 'Full', className: 'full' },
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
}

function formatDistance(v: number) {
  return v < 1 ? `${(v * 1000).toFixed(0)} m` : `${v.toFixed(1)} km`;
}

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'distance', label: 'Nearest' },
  { key: 'price', label: 'Cheapest' },
  { key: 'rating', label: 'Top Rated' },
];

export default function HomePage() {
  const laundries = useLaundryStore((s) => s.laundries);
  const [sortKey, setSortKey] = useState<SortKey>('distance');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const results = useMemo(() => {
    let list = [...laundries];
    if (statusFilter !== 'all') list = list.filter((l) => l.status === statusFilter);

    list.forEach((l) => {
      (l as any)._dist = haversineKm(userLocation.lat, userLocation.lng, l.lat, l.lng);
    });

    if (sortKey === 'distance') list.sort((a, b) => (a as any)._dist - (b as any)._dist);
    if (sortKey === 'price') list.sort((a, b) => a.pricePerKg - b.pricePerKg);
    if (sortKey === 'rating') list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [laundries, sortKey, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#F0F5F8] p-8 sm:p-12">
        {/* Decorative bubbles */}
        <div className="bubble absolute right-12 top-8 h-20 w-20 rounded-full bg-[#B8D4E3]/20" />
        <div className="bubble absolute right-20 bottom-8 h-14 w-14 rounded-full bg-[#7BA989]/15" />
        <div className="bubble absolute left-32 bottom-12 h-10 w-10 rounded-full bg-[#B8D4E3]/25" />

        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-xs font-bold text-[#7BA989] backdrop-blur-sm">
            <Sparkles size={12} /> Real-time Availability
          </span>
          <h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-nunito)" }}>
            Laundry kiloan,{" "}
            <span style={{ color: "#7BA989" }}>tanpa tunggu</span>
          </h1>
          <p className="text-base leading-relaxed text-[#6B7B8A]">
            Cek kapasitas laundry terdekat real-time. Booking slot, antar-jemput, semua dari satu tempat.
          </p>
          <div className="flex items-center gap-4 pt-1 text-sm text-[#A3B0BC]">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#B8D4E3]" />
              Jakarta Pusat
            </span>
            <span className="flex items-center gap-1.5">
              <Bike size={13} className="text-[#7BA989]" />
              {laundries.length} laundries nearby
            </span>
          </div>
        </div>
      </section>

      {/* Sort + Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#A3B0BC]" />
          {(['all', 'open', 'busy', 'full'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`sort-pill capitalize ${statusFilter === f ? 'active' : ''}`}
            >
              {f === 'all' ? 'All' : statusMeta[f].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {sortOptions.map((s) => (
            <button
              key={s.key}
              onClick={() => setSortKey(s.key)}
              className={`sort-pill ${sortKey === s.key ? 'active' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Laundry grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((laundry) => (
          <Link
            key={laundry.id}
            href={`/booking/${laundry.id}`}
            className="clean-card group flex flex-col gap-4"
          >
            {/* Status + Rating */}
            <div className="flex items-center justify-between">
              <span className={`status-badge ${statusMeta[laundry.status].className}`}>
                {statusMeta[laundry.status].label}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-[#1A1F24]">
                <Star size={13} fill="#7BA989" color="#7BA989" />
                {laundry.rating.toFixed(1)}
              </span>
            </div>

            {/* Name */}
            <h3 className="text-lg font-bold text-[#1A1F24]" style={{ fontFamily: "var(--font-nunito)" }}>
              {laundry.name}
            </h3>

            {/* Meta */}
            <div className="space-y-1.5 text-sm text-[#6B7B8A]">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-[#B8D4E3]" />
                {formatDistance((laundry as any)._dist ?? 0)} away
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 size={12} className="text-[#7BA989]" />
                {laundry.openTime} – {laundry.closeTime}
              </span>
            </div>

            {/* Price + CTA */}
            <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#EEF2F5]">
              <span className="text-lg font-black text-[#1A1F24]" style={{ fontFamily: "var(--font-nunito)" }}>
                {formatCurrency(laundry.pricePerKg)}
                <span className="text-xs font-normal text-[#A3B0BC]"> /kg</span>
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-[#7BA989] opacity-0 transition-opacity group-hover:opacity-100">
                Book <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {results.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Sparkles size={32} className="text-[#B8D4E3]" />
          <p className="text-[#A3B0BC]">No laundries match this filter</p>
        </div>
      )}
    </div>
  );
}
