import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-purple-500/10 p-12 text-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-blob animation-delay-2000" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              같이 시작해볼까요?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              작은 시작이 큰 성장이 되는 곳
              <br />
              CodeCrew와 함께 코딩 여정을 시작하세요
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/youtube">
                <Button size="lg" className="text-lg px-8 py-6">
                  학습 영상 보러가기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/youtube">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <Youtube className="mr-2 h-5 w-5" />
                  YouTube 시작하기
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground pt-4">
              무료 학습 콘텐츠 • 편하게 둘러보세요
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}
