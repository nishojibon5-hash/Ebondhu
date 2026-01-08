import { useState } from "react";
import { ArrowLeft, Search, Heart, MapPin, Zap, MessageCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  seller: {
    name: string;
    photo: string;
    rating: number;
  };
  location: string;
  category: string;
  description: string;
  liked: boolean;
}

export default function Marketplace() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("সব");

  const categories = ["সব", "ইলেকট্রনিক্স", "ফ্যাশন", "গৃহ সামগ্রী", "ক্রীড়া", "বই"];

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      title: "আইফোন 14 প্রো ম্যাক্স",
      price: 180000,
      image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=300&fit=crop",
      seller: {
        name: "মোবাইল সল্যুশন",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=mobsol",
        rating: 4.8,
      },
      location: "ঢাকা, বাংলাদেশ",
      category: "ইলেকট্রনিক্স",
      description: "নতুন, অনলকড, ওয়ারেন্টি সহ",
      liked: false,
    },
    {
      id: 2,
      title: "উইমেন্স কটন স্যাড়ি",
      price: 3500,
      image: "https://images.unsplash.com/photo-1569397788803-ecde82dedb40?w=400&h=300&fit=crop",
      seller: {
        name: "ফ্যাশন স্টোর",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=fashion",
        rating: 4.5,
      },
      location: "ঢাকা, বাংলাদেশ",
      category: "ফ্যাশন",
      description: "খাঁটি কটন, রঙ: নীল, সাইজ: M-L",
      liked: false,
    },
    {
      id: 3,
      title: "রোটি তৈরির মেশিন",
      price: 12000,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      seller: {
        name: "রসোই সরঞ্জাম",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=kitchen",
        rating: 4.7,
      },
      location: "ঢাকা, বাংলাদেশ",
      category: "গৃহ সামগ্রী",
      description: "বিদ্যুৎ চালিত, সহজ ব্যবহার",
      liked: false,
    },
    {
      id: 4,
      title: "ফুটবল (অফিসিয়াল সাইজ)",
      price: 2500,
      image: "https://images.unsplash.com/photo-1579143857253-96d4a5d3c57a?w=400&h=300&fit=crop",
      seller: {
        name: "ক্রীড়া দোকান",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=sports",
        rating: 4.6,
      },
      location: "ঢাকা, বাংলাদেশ",
      category: "ক্রীড়া",
      description: "প্রিমিয়াম কোয়ালিটি, দীর্ঘস্থায়ী",
      liked: false,
    },
    {
      id: 5,
      title: "কম্পিউটার প্রোগ্রামিং বই (বাংলা)",
      price: 450,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop",
      seller: {
        name: "বই প্রেমীদের দোকান",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=books",
        rating: 4.9,
      },
      location: "ঢাকা, বাংলাদেশ",
      category: "বই",
      description: "নতুন বই, প্রকাশক: প্রিয় প্রকাশনী",
      liked: false,
    },
    {
      id: 6,
      title: "ওয়্যারলেস হেডফোন",
      price: 5500,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      seller: {
        name: "ইলেকট্রনিক্স প্লাস",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=elecplus",
        rating: 4.4,
      },
      location: "ঢাকা, বাংলাদেশ",
      category: "ইলেকট্রনিক্স",
      description: "ব্লুটুথ ৫.০, ৩০ ঘণ্টা ব্যাটারি",
      liked: false,
    },
  ]);

  const handleLike = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, liked: !p.liked } : p
      )
    );
  };

  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === "সব" || p.category === selectedCategory) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* হেডার */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">মার্কেটপ্লেস</h1>
            <p className="text-xs text-gray-500">কেনাবেচা করুন এবং বিক্রয় করুন</p>
          </div>
        </div>
      </div>

      {/* সার্চ এবং ফিল্টার */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-40 p-4">
        <div className="max-w-4xl mx-auto">
          {/* সার্চ বার */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-bkash-500"
            />
          </div>

          {/* ক্যাটাগরি */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-bkash-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* মেইন কন্টেন্ট */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* নতুন পণ্য বিক্রয় বাটন */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-bkash-500 hover:bg-bkash-600 text-white rounded-lg font-semibold transition-all">
            <Plus className="w-5 h-5" />
            পণ্য বিক্রয় করুন
          </button>
        </div>

        {/* পণ্য গ্রিড */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600 font-semibold">কোন পণ্য পাওয়া যায়নি</p>
            <p className="text-sm text-gray-500">অন্য কিছু খোঁজার চেষ্টা করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* পণ্য ইমেজ */}
                <div className="relative overflow-hidden bg-gray-100 h-40">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                  />
                  <button
                    onClick={() => handleLike(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        product.liked
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                </div>

                {/* পণ্য বিবরণ */}
                <div className="p-4">
                  {/* দাম */}
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    ৳ {product.price.toLocaleString()}
                  </div>

                  {/* শিরোনাম */}
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">
                    {product.title}
                  </h3>

                  {/* অবস্থান */}
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    {product.location}
                  </div>

                  {/* বিক্রেতার তথ্য */}
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                    <img
                      src={product.seller.photo}
                      alt={product.seller.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold truncate">
                        {product.seller.name}
                      </p>
                      <p className="text-gray-500">
                        ⭐ {product.seller.rating}
                      </p>
                    </div>
                  </div>

                  {/* অ্যাকশন বাটন */}
                  <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-bkash-500 hover:bg-bkash-600 text-white rounded-lg font-semibold transition-colors text-sm">
                    <MessageCircle className="w-4 h-4" />
                    বার্তা পাঠান
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
