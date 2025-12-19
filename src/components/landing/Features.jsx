import { Card } from '@/components/ui/card'
import { Users, Video, Target, Trophy, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: '세션 관리',
    description: '공개/비공개 세션 생성, 실시간 참여자 관리, 포모도로 타이머',
    highlights: ['세션 생성', '필터링 & 검색', '호스트 권한']
  },
  {
    icon: Video,
    title: '실시간 커뮤니케이션',
    description: 'WebRTC 기반 화상/음성 통화, 화면 공유, 코드 스니펫 채팅',
    highlights: ['화상/음성 통화', '화면 공유', '코드 공유']
  },
  {
    icon: Target,
    title: '개인 활동 관리',
    description: '목표 설정, 진행 상황 추적, 학습 시간 통계 및 리포트',
    highlights: ['목표 설정', '활동 기록', '통계 리포트']
  },
  {
    icon: Trophy,
    title: '커뮤니티 & 업적',
    description: '업적 시스템, 피드 공유, 스터디 그룹, GitHub 연동',
    highlights: ['업적 뱃지', '그룹 기능', 'GitHub 연동']
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            개발자를 위한 <span className="text-primary">강력한 기능</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            생산성을 높이고 동기부여를 받을 수 있는 모든 도구를 제공합니다
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="flex items-start gap-6">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
