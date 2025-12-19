import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Play, Users, Video, Code } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <Badge variant="secondary" className="text-sm px-4 py-2">
            개발자를 위한 스터디 플랫폼
          </Badge>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            모여서 각자 코딩하는
            <br />
            <span className="text-primary">온라인 스터디 플랫폼</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            개발자들이 온라인에서 함께 모여 각자의 프로젝트를 진행하며,
            동기부여와 생산성을 높일 수 있는 협업 공간
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Coding Together
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">10,000+ Developers</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">24/7 Active Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">100+ Projects Daily</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="mt-16 relative">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-border shadow-2xl">
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">App Screenshot / Illustration</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
