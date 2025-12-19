import { Card } from '@/components/ui/card'
import { Users, Clock, Target, Award } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Active Developers',
    description: '활동 중인 개발자'
  },
  {
    icon: Clock,
    value: '50,000+',
    label: 'Hours Coded',
    description: '총 코딩 시간'
  },
  {
    icon: Target,
    value: '85%',
    label: 'Goal Completion',
    description: '목표 달성률'
  },
  {
    icon: Award,
    value: '1,500+',
    label: 'Achievements Earned',
    description: '획득된 업적'
  }
]

export default function Stats() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
