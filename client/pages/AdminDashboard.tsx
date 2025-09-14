import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearAdminSession,
  isAdminLoggedIn,
  verifyAdmin,
} from "../lib/adminAuth";
import { CheckCircle2, ToggleLeft, ToggleRight, LogOut } from "lucide-react";

type FeatureFlags = {
  sendMoney: boolean;
  cashIn: boolean;
  cashOut: boolean;
  recharge: boolean;
  payBill: boolean;
  addMoney: boolean;
};

const DEFAULT_FLAGS: FeatureFlags = {
  sendMoney: true,
  cashIn: true,
  cashOut: true,
  recharge: true,
  payBill: true,
  addMoney: true,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!isAdminLoggedIn()) {
        navigate("/admin-login", { replace: true });
        return;
      }
      const ok = await verifyAdmin();
      if (!ok) {
        clearAdminSession();
        navigate("/admin-login", { replace: true });
        return;
      }
      setVerified(true);
      const saved = localStorage.getItem("featureFlags");
      if (saved) setFlags({ ...DEFAULT_FLAGS, ...JSON.parse(saved) });
    };
    init();
  }, [navigate]);

  const toggle = (key: keyof FeatureFlags) => {
    const updated = { ...flags, [key]: !flags[key] };
    setFlags(updated);
  };

  const save = () => {
    localStorage.setItem("featureFlags", JSON.stringify(flags));
    alert("সেভ হয়েছে");
  };

  const logoutAdmin = () => {
    clearAdminSession();
    navigate("/admin-login", { replace: true });
  };

  if (!verified) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow p-5 mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-800">
              অ্যাডমিন ড্যাশবোর্ড
            </h1>
            <button
              onClick={logoutAdmin}
              className="text-sm text-red-600 flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" /> লগআউ���
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            ইউজার অ্যাপের ফিচার কন্ট্রোল করুন
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow divide-y">
          {(
            [
              { key: "sendMoney", label: "টাকা পাঠান" },
              { key: "cashIn", label: "ক্যাশ ইন" },
              { key: "cashOut", label: "ক্যাশ আউট" },
              { key: "recharge", label: "মোবাইল রিচার্জ" },
              { key: "payBill", label: "বিল পেমেন্ট" },
              { key: "addMoney", label: "টাকা যোগ করুন" },
            ] as { key: keyof FeatureFlags; label: string }[]
          ).map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="font-medium text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500">
                  হোম পেজে এই অপশন দেখাবেন কি না
                </p>
              </div>
              <button
                onClick={() => toggle(item.key)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                {flags[item.key] ? (
                  <>
                    <ToggleRight className="h-5 w-5 text-green-600" /> চালু
                  </>
                ) : (
                  <>
                    <ToggleLeft className="h-5 w-5 text-slate-400" /> বন্ধ
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={save}
          className="mt-4 w-full bg-bkash-600 hover:bg-bkash-700 text-white font-semibold rounded-lg p-3 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="h-5 w-5" /> সেভ করুন
        </button>

        <button
          onClick={() => navigate("/", { replace: true })}
          className="mt-2 w-full border border-slate-200 text-slate-700 font-semibold rounded-lg p-3"
        >
          ইউজার অ্যাপে যান
        </button>
      </div>
    </div>
  );
}
