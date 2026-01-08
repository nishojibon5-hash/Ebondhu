import { useState } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Heart, Share2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  attendees: number;
  interested: number;
  hosted_by: {
    name: string;
    photo: string;
  };
  going: boolean;
}

export default function Events() {
  const navigate = useNavigate();
  const [events] = useState<Event[]>([
    {
      id: 1,
      title: "ঢাকা প্রযুক্তি সম্মেলন ২০২৬",
      date: "২৫ জানুয়ারি, ২০২৬",
      time: "১০:০০ AM - ৪:০০ PM",
      location: "আন্তর্জাতিক সম্মেলন কেন্দ্র, ঢাকা",
      description: "প্রযুক্তি এবং উদ্যোক্তার জন্য বার্ষিক সম্মেলন। নেতৃস্থানীয় বিশেষজ্ঞদের থেকে শিখুন।",
      image: "https://images.unsplash.com/photo-1553531088-28dbc3456dd0?w=800&h=400&fit=crop",
      attendees: 245,
      interested: 523,
      hosted_by: {
        name: "টেক ইভেন্টস বাংলাদেশ",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=techbangla",
      },
      going: false,
    },
    {
      id: 2,
      title: "ব্যবসায়িক নেটওয়ার্কিং ব্রেকফাস্ট",
      date: "৩০ জানুয়ারি, ২০২৬",
      time: "৮:০০ AM - ১০:০০ AM",
      location: "রেডিসন ব্লু হোটেল, ঢাকা",
      description: "স্থানীয় উদ্যোক্তা এবং ব্যবসায়ীদের সাথে সংযোগ স্থাপন করুন।",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
      attendees: 87,
      interested: 156,
      hosted_by: {
        name: "বিজনেস নেটওয়ার্ক বিডি",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=biznet",
      },
      going: true,
    },
    {
      id: 3,
      title: "ডিজিটাল মার্কেটিং ওয়ার্কশপ",
      date: "৫ ফেব্রুয়ারি, ২০২৬",
      time: "২:০০ PM - ৫:০০ PM",
      location: "অনলাইন (Zoom)",
      description: "ডিজিটাল মার্কেটিং এর সর্বশেষ কৌশল এবং টুলস সম্পর্কে জানুন।",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
      attendees: 156,
      interested: 312,
      hosted_by: {
        name: "ডিজিটাল একাডেমি",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=digiacad",
      },
      going: false,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* হেডার */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ইভেন্টস</h1>
            <p className="text-xs text-gray-500">আসন্ন এবং জনপ্রিয় ইভেন্ট</p>
          </div>
        </div>
      </div>

      {/* মেইন কন্টেন্ট */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* নতুন ইভেন্ট তৈরি বাটন */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-bkash-500 hover:bg-bkash-600 text-white rounded-lg font-semibold transition-all">
            <Plus className="w-5 h-5" />
            ইভেন্ট তৈরি করুন
          </button>
        </div>

        {/* ইভেন্ট তালিকা */}
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* ইভেন্ট ইমেজ */}
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />

              {/* ইভেন্ট বিবরণ */}
              <div className="p-4">
                {/* শিরোনাম */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {event.title}
                </h3>

                {/* তারিখ, সময়, অবস্থান */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-bkash-500 flex-shrink-0" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-bkash-500 flex-shrink-0" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-bkash-500 flex-shrink-0" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                {/* বর্ণনা */}
                <p className="text-sm text-gray-600 mb-4">{event.description}</p>

                {/* হোস্ট তথ্য */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                  <img
                    src={event.hosted_by.photo}
                    alt={event.hosted_by.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-sm">
                    <p className="text-gray-900 font-semibold">
                      হোস্ট করছেন
                    </p>
                    <p className="text-gray-600">{event.hosted_by.name}</p>
                  </div>
                </div>

                {/* অংশগ্রহণকারী তথ্য */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        <strong>{event.attendees}</strong> যাচ্ছে
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        <strong>{event.interested}</strong> আগ্রহী
                      </span>
                    </div>
                  </div>
                </div>

                {/* অ্যাকশন বাটন */}
                <div className="flex gap-2">
                  {event.going ? (
                    <button className="flex-1 py-2 px-4 bg-bkash-100 text-bkash-700 rounded-lg font-semibold hover:bg-bkash-200 transition-colors text-sm">
                      ✓ যাচ্ছি
                    </button>
                  ) : (
                    <button className="flex-1 py-2 px-4 bg-bkash-500 text-white rounded-lg font-semibold hover:bg-bkash-600 transition-colors text-sm">
                      যাব
                    </button>
                  )}
                  <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm">
                    আগ্রহী
                  </button>
                  <button className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
