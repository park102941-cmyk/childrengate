import dynamic from "next/dynamic";

export const runtime = 'edge';

const LandingClient = dynamic(() => import("./LandingClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse border border-black/5">
           <img src="/children_gate_logo.png" alt="Logo" className="w-12 h-12 grayscale opacity-20" />
        </div>
        <p className="font-bold text-black/20 tracking-widest uppercase text-xs">Children Gate</p>
      </div>
    </div>
  ),
});

export default function LandingPage() {
  return <LandingClient />;
}
