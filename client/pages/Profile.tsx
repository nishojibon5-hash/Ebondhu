import { 
  User, 
  Shield, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Camera,
  Edit,
  Phone,
  Mail,
  Settings as SettingsIcon
} from "lucide-react";
import { Language } from "../App";

interface ProfileProps {
  language: Language;
}

const translations = {
  en: {
    profile: "প্রোফাইল",
    personalInfo: "ব্যক্তিগত তথ্য",
    accountSettings: "অ্যাকাউন্ট সেটিংস",
    security: "নিরাপত্তা ও গোপনীয়তা",
    notifications: "বিজ্ঞপ্তি",
    helpSupport: "সহায়তা ও সাপোর্ট",
    signOut: "সাইন আউট",
    editProfile: "প্রোফাইল সম্পাদনা",
    kycStatus: "কেওয়াইসি স্ট্যাটাস",
    verified: "যাচাইকৃত",
    linkedAccounts: "সংযুক্ত অ্যাকাউন্ট",
    paymentMethods: "পেমেন্ট পদ্ধতি",
    changePIN: "পিন পরিবর্তন",
    privacySettings: "গোপনীয়তা সেটিংস",
    contactSupport: "সাপোর্টের সাথে যোগাযোগ",
    faq: "প্রশ্ন-উত্তর",
    termsOfService: "সেবার শর্তাবলী",
    privacyPolicy: "গোপনীয়তা নীতি",
    settings: "সেটিংস"
  },
  bn: {
    profile: "প্রোফাইল",
    personalInfo: "ব্যক্তিগত তথ্য",
    accountSettings: "অ্যাকাউন্ট সেটিংস", 
    security: "নিরাপত্তা ও গোপনীয়তা",
    notifications: "বিজ্ঞপ্তি",
    helpSupport: "সহায়তা ও সাপোর্ট",
    signOut: "সাইন আউট",
    editProfile: "প্রোফাইল সম্পাদনা",
    kycStatus: "কেওয়াইসি স্ট্যাটাস",
    verified: "যাচাইকৃত",
    linkedAccounts: "সংযুক্ত অ্যাকাউন্ট",
    paymentMethods: "��েমেন্ট পদ্ধতি",
    changePIN: "পিন পরিবর্তন",
    privacySettings: "গোপনীয়তা সেটিংস",
    contactSupport: "সাপোর্টের সাথে যোগাযোগ",
    faq: "প্রশ্ন-উত্তর",
    termsOfService: "সেবার শর্তাবলী",
    privacyPolicy: "গোপনীয়তা নীতি",
    settings: "সেটিংস"
  }
};

export default function Profile({ language }: ProfileProps) {
  const t = translations[language];

  const userInfo = {
    name: "মোঃ আব্দুর রহিম",
    phone: "+৮৮০ ১৭১১ ××××××",
    email: "rahim@example.com",
    kycStatus: "verified",
    accountType: "ব্যক্তিগত অ্যাকাউন্ট"
  };

  const menuSections = [
    {
      title: t.personalInfo,
      items: [
        { icon: User, label: t.editProfile, value: null, color: "text-blue-600" },
        { icon: Shield, label: t.kycStatus, value: t.verified, verified: true, color: "text-green-600" },
        { icon: Phone, label: "ফোন নম্বর", value: userInfo.phone, color: "text-purple-600" },
        { icon: Mail, label: "ইমেইল", value: userInfo.email, color: "text-orange-600" }
      ]
    },
    {
      title: t.accountSettings,
      items: [
        { icon: CreditCard, label: t.paymentMethods, value: "২টি কার্ড", color: "text-indigo-600" },
        { icon: Shield, label: t.changePIN, value: null, color: "text-red-600" },
        { icon: SettingsIcon, label: t.settings, value: null, color: "text-gray-600" }
      ]
    },
    {
      title: t.security,
      items: [
        { icon: Shield, label: t.privacySettings, value: null, color: "text-green-600" },
        { icon: Bell, label: t.notifications, value: "চালু", color: "text-yellow-600" }
      ]
    },
    {
      title: t.helpSupport,
      items: [
        { icon: HelpCircle, label: t.contactSupport, value: null, color: "text-blue-600" },
        { icon: HelpCircle, label: t.faq, value: null, color: "text-purple-600" },
        { icon: HelpCircle, label: t.termsOfService, value: null, color: "text-gray-600" },
        { icon: HelpCircle, label: t.privacyPolicy, value: null, color: "text-gray-600" }
      ]
    }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-bkash-500 to-bkash-600 p-4 text-white">
        <h1 className="text-xl font-bold mb-4">{t.profile}</h1>
        
        {/* User Info Card */}
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <button className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm hover:scale-110 transition-transform">
                <Camera className="h-3 w-3 text-gray-600" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg">{userInfo.name}</h2>
              <p className="text-pink-100 text-sm">{userInfo.phone}</p>
              <p className="text-pink-100 text-sm">{userInfo.accountType}</p>
              <div className="flex items-center space-x-1 mt-2">
                <Shield className="h-4 w-4 text-green-300" />
                <span className="text-green-300 text-xs font-medium bg-green-500/20 px-2 py-1 rounded-full">
                  {t.verified}
                </span>
              </div>
            </div>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <Edit className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="p-4 space-y-4">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-50 rounded-full">
                        <Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.value && (
                        <span className={`text-sm ${
                          item.verified 
                            ? 'text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full' 
                            : 'text-gray-500'
                        }`}>
                          {item.value}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Sign Out Button */}
        <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:bg-red-50 transition-colors">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <LogOut className="h-5 w-5 text-red-600" />
            </div>
            <span className="font-bold text-red-600">{t.signOut}</span>
          </div>
        </button>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">লোন বন্ধু সংস্করণ ১.০.০</p>
          <p className="text-xs text-gray-400">© ২০২৪ লোন বন্ধু। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </div>
  );
}
