import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Youtube, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Sparkles className="w-3 h-3 mr-1 inline" />
            함께 성장하는 코딩 공간
          </Badge>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            혼자가 아닌,
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              함께 코딩해요
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            매일 조금씩, 함께 배우고 나누는 공간
            <br />
            CodeCrew와 함께 즐거운 코딩 여정을 시작하세요
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {/* <Link to="/youtube">
              <Button size="lg" className="text-lg px-8 py-6">
                영상 보러가기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link> */}
            <Link to="/youtube">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Youtube className="mr-2 h-5 w-5" />
                YouTube 영상
              </Button>
            </Link>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <div className="px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-sm font-medium">🎥 다양한 코딩 영상</span>
            </div>
            <div className="px-6 py-3 bg-purple-500/10 rounded-full border border-purple-500/20">
              <span className="text-sm font-medium">🤝 함께 성장</span>
            </div>
            <div className="px-6 py-3 bg-pink-500/10 rounded-full border border-pink-500/20">
              <span className="text-sm font-medium">🚀 같이 즐겨요</span>
            </div>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="mt-16 relative">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
              <div className="relative flex items-center justify-center h-full">
                <div className="text-center text-white space-y-4">
                  <Youtube className="w-20 h-20 mx-auto opacity-80" />
                  <p className="text-lg font-medium">곧 만나요!</p>
                  <p className="text-sm text-white/60">
                    가상 공간에서 함께 코딩할 날을 기대해주세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
