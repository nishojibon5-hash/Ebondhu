import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearAdminSession,
  isAdminLoggedIn,
  verifyAdmin,
} from "../lib/adminAuth";
import {
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  LogOut,
  Trash2,
  Plus,
  Copy,
  AlertTriangle,
} from "lucide-react";

type FeatureFlags = {
  sendMoney: boolean;
  cashIn: boolean;
  cashOut: boolean;
  recharge: boolean;
  payBill: boolean;
  addMoney: boolean;
};

type Banner = { id: number; image: string; link?: string };

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
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [manualTopups, setManualTopups] = useState<any[]>([]);

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
      try {
        const b = JSON.parse(localStorage.getItem("banners") || "[]");
        if (Array.isArray(b)) setBanners(b);
      } catch {}
      try {
        const r = JSON.parse(
          localStorage.getItem("manualTopupRequests") || "[]",
        );
        if (Array.isArray(r)) setManualTopups(r);
      } catch {}
    };
    init();
  }, [navigate]);

  const toggle = (key: keyof FeatureFlags) => {
    const updated = { ...flags, [key]: !flags[key] };
    setFlags(updated);
  };

  const save = () => {
    localStorage.setItem("featureFlags", JSON.stringify(flags));
    localStorage.setItem("banners", JSON.stringify(banners));
    alert("সেভ হয়েছে");
  };

  const updateRequests = (list: any[]) => {
    setManualTopups(list);
    localStorage.setItem("manualTopupRequests", JSON.stringify(list));
  };

  const approveRequest = (id: number) => {
    const list = manualTopups.map((r) =>
      r.id === id
        ? { ...r, status: "approved", reviewedAt: new Date().toISOString() }
        : r,
    );
    const req = manualTopups.find((r) => r.id === id);
    if (req) {
      // Update user balance
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const idx = users.findIndex((u: any) => u.phone === req.userPhone);
      if (idx !== -1) {
        users[idx].balance = (users[idx].balance || 0) + Number(req.amount);
        localStorage.setItem("registeredUsers", JSON.stringify(users));
      }
      // If same user is currently logged in, sync visible balance
      if (localStorage.getItem("userPhone") === req.userPhone) {
        const currentBalance = parseFloat(
          localStorage.getItem("userBalance") || "0",
        );
        localStorage.setItem(
          "userBalance",
          (currentBalance + Number(req.amount)).toString(),
        );
      }
      // Log transaction
      const transactions = JSON.parse(
        localStorage.getItem("transactions") || "[]",
      );
      transactions.unshift({
        id: Date.now(),
        type: "manual_add_money",
        amount: Number(req.amount),
        method: req.method,
        accountNumber: req.targetNumber,
        txnId: req.txnId,
        date: new Date().toISOString(),
        status: "completed",
      });
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
    updateRequests(list);
  };

  const rejectRequest = (id: number) => {
    const reason = prompt("রিজেক্টের কারণ লিখুন (ঐচ্ছিক)") || "";
    const list = manualTopups.map((r) =>
      r.id === id
        ? {
            ...r,
            status: "rejected",
            reason,
            reviewedAt: new Date().toISOString(),
          }
        : r,
    );
    updateRequests(list);
  };

  const warnUser = (phone: string) => {
    const msg =
      prompt("সতর্কবার্তা লিখুন") || "ভুয়া ট্রানজেকশন আইডি দেওয়া হয়েছে।";
    const key = "userWarnings";
    const map = JSON.parse(localStorage.getItem(key) || "{}");
    const arr = Array.isArray(map[phone]) ? map[phone] : [];
    arr.unshift({
      id: Date.now(),
      message: msg,
      date: new Date().toISOString(),
    });
    map[phone] = arr;
    localStorage.setItem(key, JSON.stringify(map));
    alert("নোটিফিকেশন পাঠানো হয়েছে");
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

        {/* Banner Management */}
        {/* Manual Add Money Requests */}
        <div className="bg-white rounded-2xl shadow p-4 mt-4">
          <h2 className="font-semibold text-slate-800 mb-3">
            ম্যানুয়াল Add Money রিকুয়েস্ট
          </h2>
          {manualTopups.length === 0 ? (
            <p className="text-sm text-slate-500">কোনো রিকুয়েস্ট নেই</p>
          ) : (
            <div className="space-y-3">
              {manualTopups.map((r) => (
                <div key={r.id} className="border rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">
                        ৳{r.amount} • {r.method?.toUpperCase?.() || r.method}
                      </p>
                      <p className="text-xs text-slate-500">
                        ইউজার: {r.userPhone} • সময়:{" "}
                        {new Date(r.createdAt).toLocaleString("bn-BD")}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${r.status === "approved" ? "bg-green-100 text-green-700" : r.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="text-slate-600">TxnID:</span>
                    <span className="font-mono text-slate-800 break-all">
                      {r.txnId}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(r.txnId)}
                      className="px-2 py-1 border rounded text-slate-600 hover:bg-slate-50 flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      কপি
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => approveRequest(r.id)}
                          className="px-3 py-2 bg-green-600 text-white rounded"
                        >
                          গ্রহণ করুন
                        </button>
                        <button
                          onClick={() => rejectRequest(r.id)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded"
                        >
                          রিজেক্ট
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => warnUser(r.userPhone)}
                      className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded flex items-center gap-1"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      ওয়ার্নিং পাঠান
                    </button>
                  </div>
                  {r.reason && (
                    <p className="text-xs text-red-600 mt-2">
                      কারণ: {r.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-4 mt-4">
          <h2 className="font-semibold text-slate-800 mb-3">
            ব্যানার ম্যানেজমেন্ট
          </h2>
          <div className="space-y-2">
            <input
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="ইমেজ URL"
              className="w-full p-2 border rounded-lg"
            />
            <input
              value={bannerLink}
              onChange={(e) => setBannerLink(e.target.value)}
              placeholder="লিংক (ঐচ্ছিক)"
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={() => {
                if (!bannerUrl.trim()) return;
                const item: Banner = {
                  id: Date.now(),
                  image: bannerUrl.trim(),
                  link: bannerLink.trim() || undefined,
                };
                const updated = [item, ...banners].slice(0, 10);
                setBanners(updated);
                setBannerUrl("");
                setBannerLink("");
              }}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-lg p-2 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> ব্যানার যোগ করুন
            </button>
          </div>

          {banners.length > 0 && (
            <div className="mt-4 space-y-2">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 p-2 border rounded-lg"
                >
                  <img
                    src={b.image}
                    alt="banner"
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{b.image}</p>
                    {b.link && (
                      <p className="text-xs text-slate-500 truncate">
                        {b.link}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setBanners(banners.filter((x) => x.id !== b.id))
                    }
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
