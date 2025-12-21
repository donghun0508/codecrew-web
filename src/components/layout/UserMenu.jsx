import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function UserMenu() {
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    setOpen(false)
    logout()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
        aria-label="User menu"
      >
        <User className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
          <Link
            to="/mypage"
            className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setOpen(false)}
          >
            마이페이지
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}
