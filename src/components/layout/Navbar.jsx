import { Button } from '@/components/ui/button'
import { Code2, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import UserMenu from './UserMenu'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isLoggedIn } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CodeCrew</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#community" className="text-foreground/80 hover:text-foreground transition-colors">
              Community
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to="/signin">
                  <Button variant="ghost">로그인</Button>
                </Link>
                <Link to="/signin">
                  <Button>회원가입</Button>
                </Link>
              </>
            ) : (
              <UserMenu />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#features" className="block text-foreground/80 hover:text-foreground transition-colors py-2">
              Features
            </a>
            <a href="#how-it-works" className="block text-foreground/80 hover:text-foreground transition-colors py-2">
              How It Works
            </a>
            <a href="#community" className="block text-foreground/80 hover:text-foreground transition-colors py-2">
              Community
            </a>
            <div className="flex flex-col space-y-2 pt-4">
              {!isLoggedIn ? (
                <>
                  <Link to="/signin">
                    <Button variant="ghost" className="w-full">로그인</Button>
                  </Link>
                  <Link to="/signin">
                    <Button className="w-full">회원가입</Button>
                  </Link>
                </>
              ) : (
                <div className="flex justify-center">
                  <UserMenu />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
