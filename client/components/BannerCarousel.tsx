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
