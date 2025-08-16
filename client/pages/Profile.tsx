import { 
  User, 
  Shield, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Camera,
  Edit
} from "lucide-react";
import { Language } from "../App";

interface ProfileProps {
  language: Language;
}

const translations = {
  en: {
    profile: "Profile",
    personalInfo: "Personal Information",
    accountSettings: "Account Settings",
    security: "Security & Privacy",
    notifications: "Notifications",
    helpSupport: "Help & Support",
    signOut: "Sign Out",
    editProfile: "Edit Profile",
    kycStatus: "KYC Status",
    verified: "Verified",
    linkedAccounts: "Linked Accounts",
    paymentMethods: "Payment Methods",
    twoFactorAuth: "Two-Factor Authentication",
    changePin: "Change PIN",
    privacySettings: "Privacy Settings",
    pushNotifications: "Push Notifications",
    emailNotifications: "Email Notifications",
    smsNotifications: "SMS Notifications",
    contactSupport: "Contact Support",
    faq: "FAQ",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy"
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
    paymentMethods: "পেমেন্ট পদ্ধতি",
    twoFactorAuth: "দ্বি-ফ্যাক্টর প্রমাণীকরণ",
    changePin: "পিন পরিবর্তন",
    privacySettings: "গোপনীয়তা সেটিংস",
    pushNotifications: "পুশ নোটিফিকেশন",
    emailNotifications: "ইমেইল নোটিফিকেশন",
    smsNotifications: "এসএমএস নোটিফিকেশন",
    contactSupport: "সাপোর্টের সাথে যোগাযোগ",
    faq: "প্রশ্ন-উত্তর",
    termsOfService: "সেবার শর্তাবলী",
    privacyPolicy: "গোপনীয়তা নীতি"
  }
};

export default function Profile({ language }: ProfileProps) {
  const t = translations[language];

  const userInfo = {
    name: "John Doe",
    phone: "+880 1711 XXXXXX",
    email: "john.doe@example.com",
    kycStatus: "verified",
    avatar: "/placeholder.svg"
  };

  const menuSections = [
    {
      title: t.personalInfo,
      items: [
        { icon: User, label: t.editProfile, value: null },
        { icon: Shield, label: t.kycStatus, value: t.verified, verified: true },
        { icon: CreditCard, label: t.linkedAccounts, value: "2 accounts" }
      ]
    },
    {
      title: t.accountSettings,
      items: [
        { icon: CreditCard, label: t.paymentMethods, value: null },
        { icon: Shield, label: t.twoFactorAuth, value: "Enabled" },
        { icon: Shield, label: t.changePin, value: null }
      ]
    },
    {
      title: t.security,
      items: [
        { icon: Shield, label: t.privacySettings, value: null },
        { icon: Bell, label: t.notifications, value: null }
      ]
    },
    {
      title: t.helpSupport,
      items: [
        { icon: HelpCircle, label: t.contactSupport, value: null },
        { icon: HelpCircle, label: t.faq, value: null },
        { icon: HelpCircle, label: t.termsOfService, value: null },
        { icon: HelpCircle, label: t.privacyPolicy, value: null }
      ]
    }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
        <h1 className="text-xl font-bold mb-4">{t.profile}</h1>
        
        {/* User Info Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <button className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
                <Camera className="h-3 w-3 text-gray-600" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{userInfo.name}</h2>
              <p className="text-indigo-100 text-sm">{userInfo.phone}</p>
              <p className="text-indigo-100 text-sm">{userInfo.email}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Shield className="h-4 w-4 text-green-300" />
                <span className="text-green-300 text-xs font-medium">{t.verified}</span>
              </div>
            </div>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <Edit className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="p-4 space-y-6">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.value && (
                        <span className={`text-sm ${
                          item.verified 
                            ? 'text-green-600 dark:text-green-400 font-medium' 
                            : 'text-gray-500 dark:text-gray-400'
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
        <button className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
              <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="font-medium text-red-600 dark:text-red-400">{t.signOut}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
