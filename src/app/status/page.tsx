'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Clock3, PackageSearch, RefreshCcw } from 'lucide-react';
import { seedLaundries } from '@/lib/seed';

const STORAGE_KEY = 'laundry-bookings-v1';

const stages = ['Confirmed', 'Picked Up', 'Washing', 'Ready', 'Delivered'] as const;

type BookingRecord = {
  id: string;
  laundryId: string;
  laundryName: string;
  kg: number;
  pickupTime: string;
  deliveryTime: string;
  notes: string;
  totalPrice: number;
  stageIndex: number;
  createdAt: string;
};

const sampleBookings: BookingRecord[] = [
  {
    id: 'booking-sample-1',
    laundryId: seedLaundries[1].id,
    laundryName: seedLaundries[1].name,
    kg: 7.5,
    pickupTime: '2026-05-02T09:00',
    deliveryTime: '2026-05-02T18:00',
    notes: 'Pisahkan pakaian kerja.',
    totalPrice: 75000,
    stageIndex: 2,
    createdAt: '2026-05-02T02:00:00.000Z',
  },
  {
    id: 'booking-sample-2',
    laundryId: seedLaundries[4].id,
    laundryName: seedLaundries[4].name,
    kg: 3,
    pickupTime: '2026-05-02T11:00',
    deliveryTime: '2026-05-03T10:00',
    notes: 'Tanpa pewangi.',
    totalPrice: 31500,
    stageIndex: 1,
    createdAt: '2026-05-02T01:15:00.000Z',
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function StatusPage() {
  const [hydrated, setHydrated] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    setHydrated(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookings(JSON.parse(stored) as BookingRecord[]);
        return;
      }
      setBookings(sampleBookings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleBookings));
    } catch {
      setBookings(sampleBookings);
    }
  }, []);

  const stats = useMemo(() => {
    const totalKg = bookings.reduce((sum, item) => sum + item.kg, 0);
    const delivered = bookings.filter((item) => item.stageIndex === stages.length - 1).length;
    const active = bookings.length - delivered;
    return { totalKg, delivered, active };
  }, [bookings]);

  const advanceStatus = (bookingId: string) => {
    setBookings((current) => {
      const updated = current.map((booking) =>
        booking.id === bookingId
          ? { ...booking, stageIndex: Math.min(booking.stageIndex + 1, stages.length - 1) }
          : booking,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  if (!hydrated) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 text-zinc-400">
        Memuat status booking...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">Tracking</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Status Booking Kamu</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Simulasi status lokal: booking baru masuk ke Confirmed, lalu bisa maju sampai Delivered.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
            {bookings.length} booking aktif
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric label="Total kilo" value={`${stats.totalKg.toFixed(1)} kg`} />
          <Metric label="Sedang berjalan" value={`${stats.active}`} />
          <Metric label="Selesai" value={`${stats.delivered}`} />
        </div>
      </section>

      {bookings.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 text-center text-zinc-400">
          Belum ada booking. Silakan buat booking dari dashboard dulu.
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <article key={booking.id} className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-200">
                      {stages[booking.stageIndex]}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
                      {booking.kg.toFixed(1)} kg
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
                      {formatCurrency(booking.totalPrice)}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">{booking.laundryName}</h2>
                    <p className="mt-1 text-sm text-zinc-400">Kode booking: {booking.id}</p>
                    <p className="mt-1 text-sm text-zinc-500">Catatan: {booking.notes || '-'}</p>
                  </div>

                  <div className="grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
                    <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                      <Clock3 className="h-4 w-4 text-orange-400" />
                      Pickup: {booking.pickupTime.replace('T', ' ')}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                      <PackageSearch className="h-4 w-4 text-orange-400" />
                      Delivery: {booking.deliveryTime.replace('T', ' ')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => advanceStatus(booking.id)}
                  disabled={booking.stageIndex >= stages.length - 1}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-zinc-700"
                >
                  {booking.stageIndex >= stages.length - 1 ? 'Sudah Delivered' : 'Update Status'}
                  <RefreshCcw className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:text-xs">
                  {stages.map((stage, index) => {
                    const active = index <= booking.stageIndex;
                    const current = index === booking.stageIndex;
                    return (
                      <div key={stage} className="space-y-2">
                        <div
                          className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border ${
                            active ? 'border-orange-500 bg-orange-500 text-white' : 'border-white/10 bg-zinc-900 text-zinc-600'
                          }`}
                        >
                          {current ? <Check className="h-4 w-4" /> : index + 1}
                        </div>
                        <p className={active ? 'text-orange-200' : 'text-zinc-500'}>{stage}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 h-2 rounded-full bg-zinc-800">
                  <div
                    className="h-2 rounded-full bg-orange-500 transition-all"
                    style={{ width: `${((booking.stageIndex + 1) / stages.length) * 100}%` }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5 text-sm text-zinc-400">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>Butuh booking baru?</p>
          <Link href="/" className="inline-flex items-center gap-2 text-orange-300 transition hover:text-orange-200">
            Buka dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
