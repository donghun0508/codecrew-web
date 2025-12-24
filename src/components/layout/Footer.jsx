import { Code2, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">CodeCrew</span>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a href="mailto:hasfw@naver.com" className="hover:text-primary transition-colors">
              hasfw@naver.com
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 CodeCrew. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
