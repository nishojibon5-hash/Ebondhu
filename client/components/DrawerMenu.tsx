import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  CreditCard,
  PiggyBank,
  Users,
  Menu,
  ChevronRight,
  LogOut,
  Share2
} from 'lucide-react';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: any;
  label: string;
  description: string;
  color: string;
  link: string;
}

export function DrawerMenu({ isOpen, onClose }: DrawerMenuProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const isSomitiManager = localStorage.getItem('isSomitiManager') === 'true';

  const menuItems: MenuItem[] = [
    {
      icon: CreditCard,
      label: 'টাস্ক আর্নিং',
      description: 'সোশ্যাল মিডিয়া কাজ করে আয় করুন',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      link: '/task-earning'
    },
    {
      icon: PiggyBank,
      label: 'লোন সার্ভিস',
      description: 'দ্রুত ও সহজ লোন আবেদন করুন',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      link: '/loan-application'
    },
    {
      icon: Users,
      label: 'সমিতি ম্যানেজার',
      description: 'সমিতির সদস্য ও লেনদেন পরিচালনা করুন',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      link: isSomitiManager ? '/somiti-manager' : '/somiti-setup'
    }
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">বিশেষ সেবাসমূহ</h2>
              <p className="text-sm text-pink-100">আয় ও লোনের সুবিধা</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Menu Content */}
        <div className="p-4 space-y-4 h-full overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.link}
                onClick={onClose}
                className={`${item.color} p-4 rounded-xl text-white block hover:scale-[1.02] transition-all duration-200 shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/60" />
                </div>
              </Link>
            );
          })}

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">আয়ের সুযোগ</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  টাস্ক করে দৈনিক ৫০০+ টাকা আয় করুন। সমিতি পরিচালনা করে অতিরিক্ত আয় পান।
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <PiggyBank className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-900 mb-1">দ্রুত লোন</h4>
                <p className="text-sm text-green-700 leading-relaxed">
                  ২৪ ঘন্টার মধ্যে লোন অনুমোদন। কম সুদে ও সহজ শর্তে।
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-purple-900 mb-1">সমিতি ব্যবস্থাপনা</h4>
                <p className="text-sm text-purple-700 leading-relaxed">
                  ডিজিটাল সমিতি পরিচালনা করুন। সদস্য ও লেনদেন ট্র্যাক করুন।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Menu button component to trigger drawer
export function DrawerMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      aria-label="বিশেষ সেবা মেনু খুলুন"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
