import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAdmin } from "../lib/adminAuth";
import { Lock, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await loginAdmin(password);
    setLoading(false);
    if (res.ok) {
      navigate("/admin", { replace: true });
    } else {
      setError(res.error || "লগইন ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-full bg-bkash-100">
            <ShieldCheck className="h-6 w-6 text-bkash-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">অ্যাডমিন লগইন</h1>
            <p className="text-sm text-slate-500">
              শুধুমাত্র অনুমোদিত ব্যবহারের জন্য
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-bkash-500"
                placeholder="অ্যাডমিন পাসওয়ার্ড"
                required
              />
              <Lock className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bkash-600 hover:bg-bkash-700 text-white font-semibold rounded-lg p-3 transition-colors disabled:opacity-70"
          >
            {loading ? "প্রসেসিং..." : "লগইন"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
            ← অ্যাপে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
