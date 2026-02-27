import dynamic from "next/dynamic";

// export const runtime = 'edge';


const AdminClient = dynamic(() => import("./AdminClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center lg:ml-64">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
           <div className="w-8 h-8 bg-white/20 rounded-full"></div>
        </div>
        <p className="font-bold text-black/50">데이터를 불러오는 중입니다...</p>
      </div>
    </div>
  ),
});

export default function AdminDashboardPage() {
  return <AdminClient />;
}
