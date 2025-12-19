import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { GraduationCap, Lightbulb, Users, Home } from 'lucide-react'

const userTypes = [
  {
    icon: GraduationCap,
    title: '주니어 개발자',
    description: '혼자 공부하기 어려운 주니어 개발자들을 위한 학습 환경',
    pain: '혼자 공부하면 집중이 안 되고 막힐 때 도움 받기 어려워요',
    solution: '함께 공부하는 환경과 즉각적인 피드백'
  },
  {
    icon: Lightbulb,
    title: '사이드 프로젝트 개발자',
    description: '개인 프로젝트를 꾸준히 진행하고 싶은 개발자',
    pain: '동기부여가 부족해서 프로젝트를 완성하지 못해요',
    solution: '목표 설정과 진행 상황 추적으로 지속성 향상'
  },
  {
    icon: Users,
    title: '온라인 스터디 참여자',
    description: '스터디 그룹을 운영하거나 참여하는 개발자',
    pain: '스터디 관리와 커뮤니케이션이 여러 툴에 흩어져 있어요',
    solution: '통합된 세션 관리와 커뮤니케이션 도구'
  },
  {
    icon: Home,
    title: '재택근무 개발자',
    description: '동료와의 연결감이 필요한 원격 근무자',
    pain: '혼자 일하다 보면 외롭고 소통이 부족해요',
    solution: '실시간 연결과 개발자 커뮤니티'
  }
]

export default function TargetUsers() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            이런 분들을 위해 <span className="text-primary">만들었습니다</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            CodeCrew는 모든 개발자의 생산성과 성장을 지원합니다
          </p>
        </div>

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userTypes.map((user, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-6">
                <Avatar className="h-16 w-16 bg-primary/10">
                  <AvatarFallback>
                    <user.icon className="h-8 w-8 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{user.title}</h3>
                  <p className="text-muted-foreground mb-4">{user.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-destructive mt-1">❌</span>
                      <p className="text-sm text-muted-foreground italic">{user.pain}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✅</span>
                      <p className="text-sm font-medium">{user.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
