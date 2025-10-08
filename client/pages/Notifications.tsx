import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCircle, ExternalLink, Trash2, ArrowLeft } from "lucide-react";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
  read?: boolean;
  date: string;
}

export default function Notifications() {
  const phone = localStorage.getItem("userPhone") || "";
  const key = "userNotifications";
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    try {
      const map = JSON.parse(localStorage.getItem(key) || "{}");
      const arr: NotificationItem[] = Array.isArray(map[phone]) ? map[phone] : [];
      setNotifications(arr);
    } catch {
      setNotifications([]);
    }
  }, [phone]);

  const update = (arr: NotificationItem[]) => {
    setNotifications(arr);
    const map = JSON.parse(localStorage.getItem(key) || "{}");
    map[phone] = arr;
    localStorage.setItem(key, JSON.stringify(map));
  };

  const markRead = (id: number) => {
    update(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAll = () => update([]);

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 rounded-lg bg-white/20"><ArrowLeft className="h-5 w-5"/></Link>
          <h1 className="text-xl font-bold">নোটিফিকেশন</h1>
        </div>
        {notifications.length > 0 && (
          <button onClick={clearAll} className="px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-sm">সব মুছুন</button>
        )}
      </div>

      <div className="p-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center text-gray-600">
            <Bell className="h-10 w-10 mx-auto text-gray-400 mb-2"/>
            কোনো নোটিফিকেশন নেই
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className={`bg-white rounded-2xl p-4 shadow-sm border ${n.read ? "border-gray-100" : "border-bkash-200"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{n.title}</h3>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleString("bn-BD")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded flex items-center gap-1 text-sm"><CheckCircle className="h-4 w-4"/>পড়া হয়েছে</button>
                    )}
                    <button onClick={() => update(notifications.filter((x) => x.id !== n.id))} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4"/></button>
                  </div>
                </div>
                {n.ctaUrl && n.ctaText && (
                  <a href={n.ctaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-3 px-3 py-2 rounded-lg bg-bkash-600 text-white text-sm">
                    {n.ctaText} <ExternalLink className="h-4 w-4"/>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
