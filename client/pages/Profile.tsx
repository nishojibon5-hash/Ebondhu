import { useState, useEffect } from "react";
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
  Settings as SettingsIcon,
  Save,
  X,
  Upload,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Language } from "../App";
import { uploadUserPhoto } from "../lib/api/media";

interface ProfileProps {
  language: Language;
}

const translations = {
  en: {
    profile: "প্রোফাইল",
    editProfile: "প্রোফাইল সম্পাদনা",
    personalInfo: "ব্যক্তিগত তথ্য",
    accountSettings: "অ্যাকাউন্ট সেট���ংস",
    security: "নিরাপত্তা ও গোপনীয়তা",
    notifications: "বিজ্ঞপ্তি",
    helpSupport: "সহায়তা ও সাপোর্ট",
    signOut: "সাইন আউট",
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
    settings: "সেটিংস",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    changePhoto: "ছবি পরিবর্তন",
    uploadPhoto: "ছবি আপলোড",
    deleteAccount: "অ্যাকাউন্ট মুছুন",
    deleteAccountWarning: "এটি স্থায়ী এবং পুনরুদ্ধারযোগ্য নয়",
    confirmDelete: "আমি বুঝি এবং আমার অ্যাকাউন্ট মুছতে চাই",
  },
  bn: {
    profile: "প্রোফাইল",
    editProfile: "প্রোফাইল সম্পাদনা",
    personalInfo: "ব্যক্তিগত তথ্য",
    accountSettings: "অ্যাকাউন্ট সেটিংস",
    security: "নিরাপত্তা ও গোপনীয়তা",
    notifications: "বিজ্ঞপ্তি",
    helpSupport: "সহায়তা ও সাপোর্ট",
    signOut: "সাইন আউট",
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
    settings: "সেটিংস",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    changePhoto: "ছবি পরিবর্তন",
    uploadPhoto: "ছবি আপলোড",
    deleteAccount: "অ্যাকাউন্ট মুছুন",
    deleteAccountWarning: "এটি স্থায়ী এবং পুনরুদ্ধারযোগ্য নয়",
    confirmDelete: "আমি বুঝি এবং আমার অ্যাকাউন্ট মুছতে চাই",
  },
};

export default function Profile({ language }: ProfileProps) {
  const navigate = useNavigate();
  const t = translations[language];
  const [isEditing, setIsEditing] = useState(false);
  const [showPinChange, setShowPinChange] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: "",
    profilePhoto: null as string | null,
    kycStatus: "verified",
    accountType: "ব্যক্তিগত অ্যাকাউন্ট",
    joinDate: "জানুয়ারি ২০২৪",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  const [pinForm, setPinForm] = useState({
    currentPin: "",
    newPin: "",
    confirmPin: "",
  });

  // Load user data from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "";
    const storedPhone = localStorage.getItem("userPhone") || "";
    const storedEmail = localStorage.getItem("userEmail") || "";
    const storedPhoto = localStorage.getItem("userPhoto");

    setUserInfo((prev) => ({
      ...prev,
      name: storedName,
      phone: storedPhone,
      email: storedEmail,
      profilePhoto: storedPhoto,
    }));

    setEditForm({
      name: storedName,
      email: storedEmail,
    });
  }, []);

  const handleEditSave = () => {
    // Update localStorage
    localStorage.setItem("userName", editForm.name);
    localStorage.setItem("userEmail", editForm.email);

    // Update state
    setUserInfo((prev) => ({
      ...prev,
      name: editForm.name,
      email: editForm.email,
    }));

    setIsEditing(false);
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a local preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        localStorage.setItem("userPhoto", result);
        setUserInfo((prev) => ({
          ...prev,
          profilePhoto: result,
        }));
      };
      reader.readAsDataURL(file);

      // Upload to Google Drive asynchronously
      try {
        const response = await uploadUserPhoto(file);
        if (response.ok && response.file) {
          // Store the file ID for future reference
          localStorage.setItem("userPhotoId", response.file.id);
        } else {
          console.error("Photo upload failed:", response.error);
        }
      } catch (error) {
        console.error("Photo upload error:", error);
      }

      setShowPhotoUpload(false);
    }
  };

  const handlePinChange = () => {
    const currentStoredPin = localStorage.getItem("userPin") || "";
    if (pinForm.currentPin !== currentStoredPin) {
      alert("বর্তমান পিন ভুল");
      return;
    }

    if (pinForm.newPin.length !== 5) {
      alert("নতুন পিন ৫ সংখ্যার হতে হবে");
      return;
    }

    if (pinForm.newPin !== pinForm.confirmPin) {
      alert("নতুন পিন মিলছে না");
      return;
    }

    // Persist new PIN
    localStorage.setItem("userPin", pinForm.newPin);
    const userPhone = localStorage.getItem("userPhone");
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const idx = users.findIndex((u: any) => u.phone === userPhone);
    if (idx !== -1) {
      users[idx].pin = pinForm.newPin;
      localStorage.setItem("registeredUsers", JSON.stringify(users));
    }

    alert("পিন সফলভাবে পরিবর্তন হয়েছে");
    setPinForm({ currentPin: "", newPin: "", confirmPin: "" });
    setShowPinChange(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhoto");
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== t.confirmDelete) {
      alert("আপনি সম্মতি দিয়ে এগিয়ে যেতে পারবেন না");
      return;
    }

    // Remove all user data
    const userPhone = localStorage.getItem("userPhone");
    localStorage.clear();

    // Remove from registered users if exists
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]",
    );
    const updatedUsers = registeredUsers.filter(
      (u: any) => u.phone !== userPhone,
    );
    if (updatedUsers.length > 0) {
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    }

    navigate("/login");
  };

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const menuSections = [
    {
      title: t.personalInfo,
      items: [
        {
          icon: User,
          label: t.editProfile,
          value: null,
          color: "text-blue-600",
          action: () => setIsEditing(true),
        },
        {
          icon: Shield,
          label: t.kycStatus,
          value: t.verified,
          verified: true,
          color: "text-green-600",
          action: null,
        },
        {
          icon: Phone,
          label: "ফোন নম্বর",
          value: userInfo.phone,
          color: "text-purple-600",
          action: null,
        },
        {
          icon: Mail,
          label: "ইমেইল",
          value: userInfo.email,
          color: "text-orange-600",
          action: null,
        },
      ],
    },
    {
      title: t.accountSettings,
      items: [
        {
          icon: CreditCard,
          label: t.paymentMethods,
          value: "২টি কার্ড",
          color: "text-indigo-600",
          action: null,
        },
        {
          icon: Lock,
          label: t.changePIN,
          value: null,
          color: "text-red-600",
          action: () => setShowPinChange(true),
        },
        {
          icon: SettingsIcon,
          label: t.settings,
          value: null,
          color: "text-gray-600",
          action: null,
        },
      ],
    },
    {
      title: t.security,
      items: [
        {
          icon: Shield,
          label: t.privacySettings,
          value: null,
          color: "text-green-600",
          action: null,
        },
        {
          icon: Bell,
          label: t.notifications,
          value: "চালু",
          color: "text-yellow-600",
          action: null,
        },
      ],
    },
    {
      title: t.helpSupport,
      items: [
        {
          icon: HelpCircle,
          label: t.contactSupport,
          value: null,
          color: "text-blue-600",
          action: null,
        },
        {
          icon: HelpCircle,
          label: t.faq,
          value: null,
          color: "text-purple-600",
          action: null,
        },
        {
          icon: HelpCircle,
          label: t.termsOfService,
          value: null,
          color: "text-gray-600",
          action: null,
        },
        {
          icon: HelpCircle,
          label: t.privacyPolicy,
          value: null,
          color: "text-gray-600",
          action: null,
        },
      ],
    },
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
              {userInfo.profilePhoto ? (
                <img
                  src={userInfo.profilePhoto}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                />
              ) : (
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
              )}
              <button
                onClick={() => setShowPhotoUpload(true)}
                className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
              >
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
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Edit className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="p-4 space-y-4">
        {menuSections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={item.action || (() => {})}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-50 rounded-full">
                        <Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <span className="font-medium text-gray-900">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.value && (
                        <span
                          className={`text-sm ${
                            item.verified
                              ? "text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full"
                              : "text-gray-500"
                          }`}
                        >
                          {item.value}
                        </span>
                      )}
                      {item.action && (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Delete Account Button */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <span className="font-bold text-red-600">{t.deleteAccount}</span>
          </div>
        </button>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <LogOut className="h-5 w-5 text-red-600" />
            </div>
            <span className="font-bold text-red-600">{t.signOut}</span>
          </div>
        </button>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">amarcash সংস্করণ ১.০.০</p>
          <p className="text-xs text-gray-400">
            © ��০২৪ amarcash। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{t.editProfile}</h3>
              <button onClick={() => setIsEditing(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  নাম
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ইমেইল
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 bg-bkash-500 hover:bg-bkash-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{t.save}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{t.changePhoto}</h3>
              <button onClick={() => setShowPhotoUpload(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-bkash-500 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">ছবি আপলোড করতে ক্লিক করুন</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="bg-bkash-500 hover:bg-bkash-600 text-white px-6 py-2 rounded-xl cursor-pointer transition-colors"
                >
                  {t.uploadPhoto}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PIN Change Modal */}
      {showPinChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{t.changePIN}</h3>
              <button onClick={() => setShowPinChange(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  বর্ত���ান পিন
                </label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    value={pinForm.currentPin}
                    onChange={(e) =>
                      setPinForm({ ...pinForm, currentPin: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                    maxLength={5}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPin ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  নতুন পিন
                </label>
                <div className="relative">
                  <input
                    type={showNewPin ? "text" : "password"}
                    value={pinForm.newPin}
                    onChange={(e) =>
                      setPinForm({ ...pinForm, newPin: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                    maxLength={5}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPin ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  নতুন পিন নিশ্চিত করুন
                </label>
                <input
                  type="password"
                  value={pinForm.confirmPin}
                  onChange={(e) =>
                    setPinForm({ ...pinForm, confirmPin: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bkash-500 focus:border-transparent"
                  maxLength={5}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPinChange(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handlePinChange}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors"
              >
                পিন পরিবর্তন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
