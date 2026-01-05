import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { getBanners } from "../lib/api/admin";

export type Banner = {
  id: string;
  image: string;
  link?: string;
  createdAt?: string;
};

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await getBanners();
        if (response.ok && response.banners) {
          setBanners(response.banners);
        } else {
          // Fallback to localStorage if server fetch fails
          const data = JSON.parse(localStorage.getItem("banners") || "[]");
          setBanners(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to load banners:", error);
        // Fallback to localStorage
        try {
          const data = JSON.parse(localStorage.getItem("banners") || "[]");
          setBanners(Array.isArray(data) ? data : []);
        } catch {
          setBanners([]);
        }
      }
    };

    loadBanners();
    // Refresh banners every 60 seconds
    const interval = setInterval(loadBanners, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      if (!emblaApi) return;
      emblaApi.scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const data = banners.length
    ? banners
    : [{ id: 0, image: "/placeholder.svg" }];

  return (
    <div className="mb-6">
      <div className="rounded-2xl border border-gray-100" ref={emblaRef}>
        <div className="flex">
          {data.map((b) => (
            <div className="min-w-0 flex-[0_0_100%] px-0 py-0" key={b.id}>
              {b.link ? (
                <a href={b.link} target="_blank" rel="noreferrer">
                  <img
                    src={b.image}
                    alt="banner"
                    className="block max-w-full h-auto mx-auto"
                  />
                </a>
              ) : (
                <img
                  src={b.image}
                  alt="banner"
                  className="block max-w-full h-auto mx-auto"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-2">
        {data.map((b) => (
          <span key={b.id} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
        ))}
      </div>
    </div>
  );
}
