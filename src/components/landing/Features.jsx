import { Card } from "@/components/ui/card";
import { Youtube, Users, Rocket, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Youtube,
    title: "영상으로 배워요",
    description: "다양한 채널의 코딩 영상을 한 곳에서",
    highlights: [
      "Python, JavaScript, React 등",
      "초급부터 고급까지",
      "무료 콘텐츠",
    ],
  },
  {
    icon: Users,
    title: "같이 성장해요",
    description: "혼자가 아닌 함께, 서로 응원하며 배워요",
    highlights: ["서로 도우며 성장", "함께하는 코딩", "따뜻한 커뮤니티"],
  },
  {
    icon: Rocket,
    title: "곧 만나요",
    description: "가상 공간에서 실시간으로 함께 코딩할 수 있어요",
    highlights: ["메타버스 공간", "실시간 협업", "화상 코딩 (Coming Soon)"],
    comingSoon: true,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            함께하면{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              더 즐거워요
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            CodeCrew와 함께 소소하게, 하지만 꾸준히 성장해요
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`p-8 hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${
                feature.comingSoon
                  ? "border-2 border-dashed border-primary/50"
                  : ""
              }`}
            >
              {feature.comingSoon && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                    Coming Soon
                  </span>
                </div>
              )}

              <div className="text-center">
                <div className="inline-block p-4 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform mb-4">
                  <feature.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.highlights.map((highlight, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-center gap-2 text-sm"
                    >
                      <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        {/* <div className="text-center mt-12">
          <Link to="/youtube">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity">
              지금 시작하기 →
            </button>
          </Link>
        </div> */}
      </div>
    </section>
  );
}
