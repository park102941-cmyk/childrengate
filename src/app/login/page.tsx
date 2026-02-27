import dynamic from "next/dynamic";

// export const runtime = 'edge';


const LoginClient = dynamic(() => import("./LoginClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse border border-black/5">
           <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
        </div>
        <p className="font-bold text-black/50">안전한 로그인을 위해 준비 중...</p>
      </div>
    </div>
  ),
});

export default function LoginPage() {
  return <LoginClient />;
}
