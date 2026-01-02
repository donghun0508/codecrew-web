import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpExtraPage from './pages/SignUpExtraPage'
import MyPage from './pages/MyPage'
import YoutubePage from './pages/YoutubePage'
import WorldPage from './pages/WorldPage'
import RoadmapPage from './pages/RoadmapPage'
import GoogleOAuthCallback from './pages/oauth/GoogleOAuthCallback'
import KakaoOAuthCallback from './pages/oauth/KakaoOAuthCallback'
import NaverOAuthCallback from './pages/oauth/NaverOAuthCallback'
import KeycloakOAuthCallback from './pages/oauth/KeycloakOAuthCallback'
import NotFoundPage from './pages/errors/NotFoundPage'
import ServerErrorPage from './pages/errors/ServerErrorPage'
import ConnectionErrorPage from './pages/errors/ConnectionErrorPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/world" element={<WorldPage />} />
          <Route path="/youtube" element={<YoutubePage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup-extra" element={<SignUpExtraPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/oauth2/code/google" element={<GoogleOAuthCallback />} />
          <Route path="/oauth2/code/kakao" element={<KakaoOAuthCallback />} />
          <Route path="/oauth2/code/naver" element={<NaverOAuthCallback />} />
          <Route path="/oauth/callback" element={<KeycloakOAuthCallback />} />

          {/* Error Pages */}
          <Route path="/error/server" element={<ServerErrorPage />} />
          <Route path="/error/connection" element={<ConnectionErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
