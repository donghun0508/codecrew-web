import { Button } from "@/components/ui/button";
import { Code2, Menu, X, Map } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "./UserMenu";
import youtubeIcon from "@/assets/youtube.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo + Navigation */}
          <div className="flex items-center gap-20">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">CodeCrew</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/youtube"
                className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
              >
                <img src={youtubeIcon} alt="YouTube" className="w-6 h-6" />
                <span>YouTube</span>
              </Link>
              <Link
                to="/roadmap"
                className="flex hidden items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
              >
                <Map className="w-5 h-5" />
                <span>로드맵</span>
              </Link>
            </div>
          </div>

          {/* Right side: CTA Button */}
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
            <Link
              to="/youtube"
              className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              <img src={youtubeIcon} alt="YouTube" className="w-6 h-6" />
              <span>YouTube</span>
            </Link>
            <Link
              to="/roadmap"
              className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              <Map className="w-5 h-5" />
              <span>로드맵</span>
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              {!isLoggedIn ? (
                <>
                  <Link to="/signin">
                    <Button variant="ghost" className="w-full">
                      로그인
                    </Button>
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
  );
}
