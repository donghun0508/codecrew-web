import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Code2, TrendingUp, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: '세션 생성 또는 참여',
    description: '원하는 시간에 맞춰 세션을 만들거나, 진행 중인 세션에 참여하세요',
    details: '공개/비공개 세션, 태그별 필터링, 초대 링크 공유'
  },
  {
    number: 2,
    icon: Code2,
    title: '함께 코딩하기',
    description: '화상/음성 연결로 함께하는 느낌을 받으며 각자 집중해서 개발하세요',
    details: '실시간 통화, 화면 공유, 코드 스니펫 공유, 포모도로 타이머'
  },
  {
    number: 3,
    icon: TrendingUp,
    title: '성장 추적하기',
    description: '목표 달성률과 학습 시간을 확인하고 업적을 획득하세요',
    details: '활동 통계, 연속 참여 기록, 업적 뱃지, 커뮤니티 피드'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">HOW IT WORKS</Badge>
          <h2 className="text-4xl font-bold mb-4">
            간단한 <span className="text-primary">3단계</span>로 시작하세요
          </h2>
          <p className="text-xl text-muted-foreground">
            회원가입부터 목표 달성까지, 쉽고 직관적인 과정
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-8 h-full hover:shadow-lg transition-shadow">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-8">
                    <Badge className="h-8 w-8 rounded-full flex items-center justify-center text-lg font-bold">
                      {step.number}
                    </Badge>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <step.icon className="h-12 w-12 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {step.description}
                  </p>
                  <p className="text-sm text-muted-foreground/80 text-center">
                    {step.details}
                  </p>
                </Card>

                {/* Arrow (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
