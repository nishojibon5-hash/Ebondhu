import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Banknote, CheckCircle, Copy, Phone, Wallet } from "lucide-react";

interface WalletConfig {
  enabled: boolean;
  reserve: number;
}

type WalletKey = "bkash" | "nagad" | "rocket";

const DEFAULT_WALLETS: Record<WalletKey, WalletConfig> = {
  bkash: { enabled: true, reserve: 0 },
  nagad: { enabled: true, reserve: 0 },
  rocket: { enabled: false, reserve: 0 },
};

export default function CashOut() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState<WalletKey | "">("");
  const [number, setNumber] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [wallets, setWallets] = useState<Record<WalletKey, WalletConfig>>(DEFAULT_WALLETS);

  const balance = useMemo(() => parseFloat(localStorage.getItem("userBalance") || "0"), []);

  useEffect(() => {
    try {
      const cfg = JSON.parse(localStorage.getItem("payoutWalletConfig") || "null");
      if (cfg && typeof cfg === "object") setWallets({ ...DEFAULT_WALLETS, ...cfg });
    } catch {}
  }, []);

  const availableWallets = (Object.keys(wallets) as WalletKey[]).filter((k) => wallets[k].enabled);

  const validateStep1 = () => {
    const a = parseFloat(amount);
    const errs: any = {};
    if (!wallet) errs.wallet = "ওয়ালেট নির্বাচন করুন";
    if (!amount || isNaN(a) || a <= 0) errs.amount = "সঠিক পরিমাণ দিন";
    if (a > balance) errs.amount = "ব্যালেন্সের চেয়ে বেশি";
    if (!number || number.length !== 11 || !number.startsWith("01")) errs.number = "সঠিক ওয়ালেট নম্বর দিন";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitRequest = () => {
    if (!validateStep1()) return;
    const req = {
      id: Date.now(),
      userPhone: localStorage.getItem("userPhone") || "unknown",
      amount: parseFloat(amount),
      wallet,
      accountNumber: number,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const key = "cashoutRequests";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.unshift(req);
    localStorage.setItem(key, JSON.stringify(list));
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="pb-20 min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
          <h1 className="text-xl font-bold">রিকুয়েস্ট পাঠানো হয়েছে</h1>
        </div>
        <div className="p-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">এডমিনের অনুমোদনের অপেক্ষায়</h2>
            <p className="text-gray-600 mb-6">এডমিন যাচাই করে ম্যানুয়ালি অর্থ প্রেরণ করবেন</p>
            <div className="space-y-3">
              <button onClick={() => navigate("/" )} className="w-full bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors">হোমে ফিরুন</button>
              <button onClick={() => { setStep(1); setAmount(""); setWallet(""); setNumber(""); setErrors({}); }} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-colors">আরেকটি ক্যাশ আউট</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
        <h1 className="text-xl font-bold">ক্যাশ আউট</h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">উপলব্ধ ব্যালেন্স</p>
              <p className="text-2xl font-bold text-bkash-600">৳{balance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Step 1: Input */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
          {/* Wallets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ওয়ালেট নির্বাচন করুন</label>
            <div className="grid grid-cols-3 gap-2">
              {availableWallets.map((w) => (
                <button key={w} onClick={() => setWallet(w)} className={`p-3 rounded-xl border ${wallet === w ? "border-bkash-500 bg-pink-50" : "border-gray-200"}`}>
                  <div className="flex flex-col items-center text-sm">
                    <Wallet className="h-5 w-5 mb-1 text-bkash-500" />
                    <span>{w === "bkash" ? "বিকাশ" : w === "nagad" ? "নগদ" : "রকেট"}</span>
                  </div>
                </button>
              ))}
            </div>
            {errors.wallet && <p className="text-red-500 text-sm mt-1">{errors.wallet}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">পরিমাণ (৳)</label>
            <div className="relative">
              <Banknote className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" step="0.01" className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${errors.amount ? "border-red-500" : "border-gray-300"}`} />
            </div>
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          {/* Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ওয়ালেট নম্বর</label>
            <div className="relative">
              <Phone className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
              <input type="tel" value={number} onChange={(e) => setNumber(e.target.value.replace(/[^0-9]/g, ""))} placeholder="01XXXXXXXXX" maxLength={11} className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent ${errors.number ? "border-red-500" : "border-gray-300"}`} />
              <button type="button" onClick={() => { navigator.clipboard.writeText(number); }} className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"><Copy className="h-4 w-4"/>কপি</button>
            </div>
            {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
          </div>

          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
            <div className="flex items-start gap-2 text-blue-900 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <p>রিকুয়েস্ট সাবমিট করলে এডমিন যাচাই করে আপনার নম্বরে টাকা পাঠাবেন। অনুমোদনের পর আপনার ব্যালেন্স থেকে টাকা কাটা হবে এবং এডমিন ওয়ালেটে যোগ হবে।</p>
            </div>
          </div>

          <button onClick={submitRequest} className="w-full bg-bkash-600 hover:bg-bkash-700 text-white py-3 rounded-xl font-semibold">রিকুয়েস্ট সাবমিট করুন</button>
        </div>
      </div>
    </div>
  );
}
