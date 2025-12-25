import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Map, Code, Server, Cloud, Brain } from "lucide-react";
import RoadmapSH from "@/components/roadmap/RoadmapSH";

// 트리 구조 로드맵 데이터 (추후 API로 전환 예정)
const roadmapsData = {
  frontend: {
    id: "frontend",
    title: "프론트엔드 개발자",
    icon: Code,
    description: "사용자가 보는 화면을 만드는 개발자",
    color: "bg-blue-500",
    children: [
      {
        id: "frontend-basics",
        title: "필수 기초",
        level: "beginner",
        children: [
          { id: "html", title: "HTML", description: "웹 페이지의 구조" },
          { id: "css", title: "CSS", description: "웹 페이지의 스타일링" },
          { id: "javascript", title: "JavaScript", description: "웹 페이지의 동작" },
        ],
      },
      {
        id: "frontend-frameworks",
        title: "프레임워크",
        level: "intermediate",
        children: [
          {
            id: "react",
            title: "React",
            description: "가장 인기 있는 UI 라이브러리",
            children: [
              { id: "nextjs", title: "Next.js", description: "React 풀스택 프레임워크" },
              { id: "redux", title: "Redux", description: "전역 상태 관리" },
              { id: "react-query", title: "React Query", description: "서버 상태 관리" },
            ],
          },
          { id: "vue", title: "Vue.js", description: "점진적 프레임워크" },
          { id: "angular", title: "Angular", description: "구글의 프레임워크" },
        ],
      },
      {
        id: "frontend-styling",
        title: "스타일링",
        level: "intermediate",
        children: [
          { id: "tailwind", title: "Tailwind CSS", description: "유틸리티 우선 CSS" },
          { id: "styled-components", title: "Styled Components", description: "CSS-in-JS" },
          { id: "sass", title: "SASS/SCSS", description: "CSS 전처리기" },
        ],
      },
    ],
  },
  backend: {
    id: "backend",
    title: "백엔드 개발자",
    icon: Server,
    description: "서버와 데이터베이스를 다루는 개발자",
    color: "bg-green-500",
    children: [
      {
        id: "backend-languages",
        title: "프로그래밍 언어",
        level: "beginner",
        children: [
          { id: "nodejs", title: "JavaScript (Node.js)", description: "비동기 처리" },
          { id: "python", title: "Python", description: "쉽고 강력한 언어" },
          { id: "java", title: "Java", description: "엔터프라이즈" },
        ],
      },
      {
        id: "backend-frameworks",
        title: "프레임워크",
        level: "intermediate",
        children: [
          { id: "express", title: "Express.js", description: "Node.js 웹 프레임워크" },
          { id: "nestjs", title: "NestJS", description: "TypeScript 프레임워크" },
          { id: "spring", title: "Spring Boot", description: "Java 프레임워크" },
        ],
      },
      {
        id: "backend-database",
        title: "데이터베이스",
        level: "intermediate",
        children: [
          { id: "postgresql", title: "PostgreSQL", description: "관계형 DB" },
          { id: "mongodb", title: "MongoDB", description: "NoSQL DB" },
          { id: "redis", title: "Redis", description: "인메모리 저장소" },
        ],
      },
    ],
  },
  devops: {
    id: "devops",
    title: "DevOps 엔지니어",
    icon: Cloud,
    description: "개발과 운영을 연결하는 엔지니어",
    color: "bg-purple-500",
    children: [
      {
        id: "devops-basics",
        title: "기초 지식",
        level: "beginner",
        children: [
          { id: "linux", title: "Linux", description: "서버 운영체제" },
          { id: "bash", title: "Bash/Shell", description: "자동화 스크립트" },
          { id: "git", title: "Git", description: "버전 관리" },
        ],
      },
      {
        id: "devops-containers",
        title: "컨테이너",
        level: "intermediate",
        children: [
          { id: "docker", title: "Docker", description: "컨테이너 플랫폼" },
          { id: "k8s", title: "Kubernetes", description: "컨테이너 오케스트레이션" },
        ],
      },
      {
        id: "devops-cloud",
        title: "클라우드",
        level: "advanced",
        children: [
          { id: "aws", title: "AWS", description: "아마존 클라우드" },
          { id: "gcp", title: "Google Cloud", description: "구글 클라우드" },
          { id: "azure", title: "Azure", description: "MS 클라우드" },
        ],
      },
    ],
  },
  ai: {
    id: "ai",
    title: "AI/ML 개발자",
    icon: Brain,
    description: "인공지능과 머신러닝 모델을 만드는 개발자",
    color: "bg-orange-500",
    children: [
      {
        id: "ai-basics",
        title: "프로그래밍 기초",
        level: "beginner",
        children: [
          { id: "python-ai", title: "Python", description: "AI/ML 주력 언어" },
          { id: "numpy", title: "NumPy", description: "수치 계산" },
          { id: "pandas", title: "Pandas", description: "데이터 분석" },
        ],
      },
      {
        id: "ai-ml",
        title: "머신러닝",
        level: "intermediate",
        children: [
          { id: "sklearn", title: "Scikit-learn", description: "머신러닝 라이브러리" },
          { id: "tensorflow", title: "TensorFlow", description: "딥러닝 프레임워크" },
          { id: "pytorch", title: "PyTorch", description: "딥러닝 프레임워크" },
        ],
      },
      {
        id: "ai-advanced",
        title: "최신 트렌드",
        level: "advanced",
        children: [
          { id: "llm", title: "LLM (GPT)", description: "대규모 언어 모델" },
          { id: "stable-diffusion", title: "Stable Diffusion", description: "이미지 생성 AI" },
          { id: "langchain", title: "LangChain", description: "LLM 애플리케이션" },
        ],
      },
    ],
  },
};

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState("frontend");
  const currentRoadmap = roadmapsData[activeTab];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-b border-white/10">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="flex flex-col items-center justify-center text-center text-white space-y-6">
            {/* Icon */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl">
                <Map className="w-16 h-16 md:w-20 md:h-20" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                개발자 로드맵
              </h1>
              <p className="text-base md:text-xl text-white/70 max-w-2xl">
                어떤 개발자가 될지 고민 중이신가요?
                <br />
                각 분야별 로드맵을 확인해보세요
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b bg-background/95 backdrop-blur-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Object.values(roadmapsData).map((roadmap) => {
              const Icon = roadmap.icon;
              return (
                <button
                  key={roadmap.id}
                  onClick={() => setActiveTab(roadmap.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                    activeTab === roadmap.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-background text-foreground border-2 border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{roadmap.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Roadmap Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Roadmap Header */}
        <div className="text-center mb-8">
          <div className={`inline-block p-4 ${currentRoadmap.color} rounded-2xl mb-4`}>
            <currentRoadmap.icon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {currentRoadmap.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {currentRoadmap.description}
          </p>
          <p className="text-sm text-muted-foreground">
            💡 도로를 따라 단계별로 로드맵을 탐험하세요
          </p>
        </div>

        {/* Roadmap SH Style */}
        <RoadmapSH roadmapData={currentRoadmap} />
      </main>

      <Footer />
    </div>
  );
}
