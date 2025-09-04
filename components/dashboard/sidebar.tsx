"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Music, Home, Search, Upload, ListMusic, Heart, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Search", href: "/dashboard/search", icon: Search },
  { name: "Upload", href: "/dashboard/upload", icon: Upload },
  { name: "Playlists", href: "/dashboard/playlists", icon: ListMusic },
  { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    console.log("[v0] User logout initiated")
    // Placeholder logout logic
    window.location.href = "/"
  }

  const handleLinkClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50 transition-transform duration-300 ease-in-out",
        // Hidden by default on mobile, visible when open or always visible on desktop
        "transform -translate-x-full md:translate-x-0",
        isOpen && "translate-x-0",
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={handleLinkClick}>
          <Music className="h-8 w-8 text-sidebar-primary" />
          <span className="text-2xl font-bold text-sidebar-foreground">Harmoniq</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              asChild
            >
              <Link href={item.href} onClick={handleLinkClick}>
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          asChild
        >
          <Link href="/dashboard/settings" onClick={handleLinkClick}>
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex-1 justify-start gap-3 h-12 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
          <div className="flex justify-center sm:justify-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
