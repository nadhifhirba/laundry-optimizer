'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect, type FormEvent, type ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarClock, CheckCircle2, ReceiptText, Sparkles } from 'lucide-react';
import { seedLaundries } from '@/lib/seed';
import { useLaundryStore } from '@/lib/store';

const STORAGE_KEY = 'laundry-bookings-v1';

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

function toDateTimeLocalInput(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export default function BookingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const bookLaundry = useLaundryStore((state) => state.bookLaundry);
  const laundry = useMemo(() => seedLaundries.find((item) => item.id === params.id), [params.id]);

  const [kg, setKg] = useState(5);
  const [pickupTime, setPickupTime] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [savedBooking, setSavedBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    const now = new Date();
    const pickup = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const delivery = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    setPickupTime(toDateTimeLocalInput(pickup));
    setDeliveryTime(toDateTimeLocalInput(delivery));
  }, []);

  const totalPrice = useMemo(() => {
    if (!laundry) return 0;
    return kg * laundry.price_per_kg;
  }, [kg, laundry]);

  if (!laundry) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-zinc-950/80 p-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Booking</p>
        <h1 className="mt-3 text-2xl font-bold text-white">Laundry tidak ditemukan</h1>
        <p className="mt-2 text-zinc-400">Coba kembali ke dashboard untuk memilih tempat laundry yang aktif.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!pickupTime || !deliveryTime) {
      setMessage('Lengkapi jadwal pickup dan delivery dulu ya.');
      return;
    }

    if (new Date(deliveryTime).getTime() <= new Date(pickupTime).getTime()) {
      setMessage('Waktu delivery harus setelah pickup.');
      return;
    }

    const booking: BookingRecord = {
      id: `booking-${Date.now()}`,
      laundryId: laundry.id,
      laundryName: laundry.name,
      kg,
      pickupTime,
      deliveryTime,
      notes: notes.trim(),
      totalPrice,
      stageIndex: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as BookingRecord[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([booking, ...existing]));
      bookLaundry(laundry.id, kg);
      setSavedBooking(booking);
      setMessage('Booking berhasil disimpan. Cek detail status di bawah atau buka halaman status.');
      router.refresh();
    } catch {
      setMessage('Gagal menyimpan booking. Coba lagi ya.');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Link href="/" className="inline-flex items-center gap-2 text-orange-300 transition hover:text-orange-200">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
          <span>•</span>
          <span>Booking Laundry</span>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-orange-300/80">Siap booking</p>
          <h1 className="text-3xl font-black tracking-tight text-white">{laundry.name}</h1>
          <p className="text-sm leading-6 text-zinc-400">{laundry.address}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <MiniStat label="Harga/kg" value={formatCurrency(laundry.price_per_kg)} icon={<ReceiptText className="h-4 w-4" />} />
          <MiniStat label="Rating" value={laundry.rating.toFixed(1)} icon={<Sparkles className="h-4 w-4" />} />
          <MiniStat label="Jam operasional" value={laundry.open_hours} icon={<CalendarClock className="h-4 w-4" />} />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <label className="text-sm font-semibold text-white">Berat cucian (kg)</label>
            <input
              type="number"
              min="1"
              step="0.5"
              value={kg}
              onChange={(event) => setKg(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none ring-0 placeholder:text-zinc-500 focus:border-orange-500/50"
            />
            <p className="mt-2 text-xs text-zinc-500">Gunakan estimasi berat total pakaian kotor kamu.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Waktu pickup" type="datetime-local" value={pickupTime} onChange={setPickupTime} />
            <Field label="Waktu delivery" type="datetime-local" value={deliveryTime} onChange={setDeliveryTime} />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <label className="text-sm font-semibold text-white">Catatan khusus</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Contoh: pisahkan pakaian putih, jangan pakai pewangi kuat"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-orange-500/50"
            />
          </div>

          {message ? (
            <div className="rounded-3xl border border-orange-500/30 bg-orange-500/10 p-4 text-sm text-orange-100">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
          >
            <CheckCircle2 className="h-4 w-4" />
            Book Now
          </button>
        </form>
      </section>

      <aside className="space-y-4 rounded-3xl border border-white/10 bg-zinc-950/80 p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Ringkasan harga</p>
        <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-5">
          <p className="text-sm text-orange-200">Estimasi total</p>
          <p className="mt-2 text-4xl font-black text-white">{formatCurrency(totalPrice)}</p>
          <p className="mt-2 text-sm text-zinc-300">{kg.toFixed(1)} kg × {formatCurrency(laundry.price_per_kg)} / kg</p>
        </div>

        <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
          <SummaryLine label="Pickup" value={pickupTime ? pickupTime.replace('T', ' ') : '-'} />
          <SummaryLine label="Delivery" value={deliveryTime ? deliveryTime.replace('T', ' ') : '-'} />
          <SummaryLine label="Lokasi" value={laundry.name} />
          <SummaryLine label="Status okupansi" value={laundry.status.toUpperCase()} />
        </div>

        {savedBooking ? (
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-sm font-semibold text-emerald-100">Booking tersimpan</p>
            <p className="mt-1 text-sm text-emerald-50/80">Kode: {savedBooking.id}</p>
            <Link
              href="/status"
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white"
            >
              Lihat Status Booking
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: 'datetime-local';
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <label className="text-sm font-semibold text-white">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-500/50"
      />
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right font-medium text-white">{value}</span>
    </div>
  );
}
