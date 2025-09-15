import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export type Banner = {
  id: number;
  image: string;
  link?: string;
};

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    const load = () => {
      try {
        const data = JSON.parse(localStorage.getItem("banners") || "[]");
        setBanners(Array.isArray(data) ? data : []);
      } catch {
        setBanners([]);
      }
    };
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "banners") load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      if (!emblaApi) return;
      emblaApi.scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  if (!banners.length) return null;

  return (
    <div className="mb-6">
      <div
        className="overflow-hidden rounded-2xl border border-gray-100"
        ref={emblaRef}
      >
        <div className="flex">
          {banners.map((b) => (
            <div className="min-w-0 flex-[0_0_100%]" key={b.id}>
              {b.link ? (
                <a href={b.link} target="_blank" rel="noreferrer">
                  <img
                    src={b.image}
                    alt="banner"
                    className="w-full h-36 object-cover"
                  />
                </a>
              ) : (
                <img
                  src={b.image}
                  alt="banner"
                  className="w-full h-36 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-2">
        {banners.map((b, i) => (
          <span key={b.id} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
        ))}
      </div>
    </div>
  );
}
