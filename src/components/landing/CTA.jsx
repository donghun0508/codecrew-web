import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Github } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/20 p-12 text-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              수천 명의 개발자들이 이미 CodeCrew와 함께 성장하고 있습니다.
              당신도 오늘부터 시작해보세요!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="text-lg px-8 py-6">
                무료로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Github className="mr-2 h-5 w-5" />
                GitHub으로 시작하기
              </Button>
            </div>

            <p className="text-sm text-muted-foreground pt-4">
              신용카드 필요 없음 • 언제든지 취소 가능 • 무료 플랜 영구 제공
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}
