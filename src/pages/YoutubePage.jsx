import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { youtubeApi } from "@/api/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Spinner from "@/components/common/Spinner";
import { Play, Youtube, Search, ArrowUp } from "lucide-react";

export default function YoutubePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [lastVideoId, setLastVideoId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const observerTarget = useRef(null);

  const loadVideos = useCallback(async () => {
    if (loading || !hasNext) return;

    try {
      setLoading(true);
      const response = await youtubeApi.getVideos(12, lastVideoId);
      const {
        videos: newVideos,
        hasNext: nextPage,
        lastVideoId: nextLastId,
      } = response.data.data;

      setVideos((prev) => [...prev, ...newVideos]);
      setHasNext(nextPage);
      setLastVideoId(nextLastId);
    } catch (error) {
      console.error("Failed to load videos:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasNext, lastVideoId]);

  // 검색 필터링
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;

    const query = searchQuery.toLowerCase();
    return videos.filter(
      (video) =>
        video.title.toLowerCase().includes(query) ||
        (video.description && video.description.toLowerCase().includes(query))
    );
  }, [videos, searchQuery]);

  useEffect(() => {
    loadVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          loadVideos();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNext, loading, loadVideos]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-b border-white/10">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="flex flex-col items-center justify-center text-center text-white space-y-6">
            {/* Icon with Glow */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl">
                <Youtube className="w-16 h-16 md:w-20 md:h-20" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                코딩 영상
              </h1>
              <p className="text-base md:text-xl text-white/70 max-w-2xl">
                다양한 채널의 코딩 영상을 한눈에
              </p>
            </div>

            {/* Decorative Pills */}
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                Python
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                JavaScript
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                React
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                알고리즘
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="border-b bg-background/95 backdrop-blur-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="영상 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-center text-sm text-muted-foreground mt-3">
                {filteredVideos.length}개의 영상 찾음
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-8 overflow-x-auto pb-0 pl-8">
            <TabButton active={true}>전체</TabButton>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {videos.length === 0 && loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {hasNext && (
              <div ref={observerTarget} className="flex justify-center py-8">
                {loading && <Spinner />}
              </div>
            )}

            {!hasNext && videos.length > 0 && !searchQuery && (
              <div className="text-center py-12">
                <Badge variant="outline" className="text-base px-6 py-2">
                  모든 영상을 불러왔습니다
                </Badge>
              </div>
            )}

            {filteredVideos.length === 0 && searchQuery && !loading && (
              <div className="text-center py-20">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-muted-foreground">
                  다른 키워드로 검색해보세요
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-white text-foreground border-2 border-border rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group"
          aria-label="맨 위로 이동"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}

      <Footer />
    </div>
  );
}

function VideoCard({ video }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    const currentCard = cardRef.current;
    if (currentCard) {
      observer.observe(currentCard);
    }

    return () => {
      if (currentCard) {
        observer.unobserve(currentCard);
      }
    };
  }, []);

  return (
    <a
      ref={cardRef}
      href={video.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>

        <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/25 hover:-translate-y-2 border-2 border-border/50 hover:border-transparent bg-card/80 backdrop-blur-sm">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            {/* Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-primary rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-primary-foreground fill-current" />
                </div>
              </div>
            </div>

            {/* Gradient Overlay Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </div>

          {/* Content */}
          <CardContent className="p-5 relative">
            <h3 className="font-bold text-base line-clamp-2 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
              {video.title}
            </h3>
            {video.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {video.description}
              </p>
            )}

            {/* Decorative Corner */}
            <div className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-full h-full border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </a>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
        active
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-background text-foreground border-2 border-border hover:border-primary/50"
      }`}
    >
      {children}
    </button>
  );
}
