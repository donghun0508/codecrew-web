import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function MyPage() {
  const { userInfo } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">마이페이지</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">사용자 정보</h2>
            {userInfo ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">닉네임:</span> {userInfo.nickname || '-'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">이메일:</span> {userInfo.email || '-'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">사용자 정보를 불러올 수 없습니다.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
