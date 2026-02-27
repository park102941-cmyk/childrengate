import dynamic from "next/dynamic";

// export const runtime = 'edge';


const SignupClient = dynamic(() => import("./SignupClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse border border-black/5">
           <div className="w-8 h-8 bg-blue-500/20 rounded-full"></div>
        </div>
        <p className="font-bold text-black/50">가입 페이지 준비 중...</p>
      </div>
    </div>
  ),
});

export default function SignupPage() {
  return <SignupClient />;
}
