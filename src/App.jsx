import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpExtraPage from './pages/SignUpExtraPage'
import GoogleOAuthCallback from './pages/oauth/GoogleOAuthCallback'
import KakaoOAuthCallback from './pages/oauth/KakaoOAuthCallback'
import NaverOAuthCallback from './pages/oauth/NaverOAuthCallback'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup-extra" element={<SignUpExtraPage />} />
        <Route path="/oauth2/code/google" element={<GoogleOAuthCallback />} />
        <Route path="/oauth2/code/kakao" element={<KakaoOAuthCallback />} />
        <Route path="/oauth2/code/naver" element={<NaverOAuthCallback />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
