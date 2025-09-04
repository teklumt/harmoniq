import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Music, Upload, Search, Heart, ListMusic, Play, Users, Star } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-xl sm:text-2xl font-bold text-foreground">Harmoniq</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
            {/* Mobile navigation buttons */}
            <div className="flex sm:hidden items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Start</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-balance mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Music, Your Way
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-pretty max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
              Discover, upload, and share music with the world. Create playlists, find new favorites, and connect with
              artists on Harmoniq.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6" asChild>
              <Link href="/register">Start Streaming Free</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-transparent"
              asChild
            >
              <Link href="/demo">
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-balance px-2">
              Everything You Need for Music
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-4">
              From discovery to creation, Harmoniq provides all the tools you need for your musical journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-4 sm:pt-6">
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <div className="p-2 sm:p-3 bg-accent/10 rounded-full">
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Upload Music</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Share your original tracks with metadata and reach new audiences.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-4 sm:pt-6">
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                    <Search className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Discover Music</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Find new artists and songs with our powerful search and recommendation engine.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-4 sm:pt-6">
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <div className="p-2 sm:p-3 bg-accent/10 rounded-full">
                    <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Save Favorites</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Keep track of songs you love and build your personal music library.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-4 sm:pt-6">
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                    <ListMusic className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Create Playlists</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Organize your music into custom playlists and share them with friends.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-balance px-2">
              Loved by Music Enthusiasts
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground px-4">
              See what our community has to say about their Harmoniq experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="p-4 sm:p-6">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  "Harmoniq has completely changed how I discover new music. The recommendation system is incredible!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold">Sarah Chen</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Music Lover</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 sm:p-6">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  "As an independent artist, Harmoniq gives me the perfect platform to share my music with the world."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Music className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold">Marcus Rodriguez</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Independent Artist</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 sm:p-6">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  "The playlist creation tools are amazing. I've organized my entire music collection effortlessly."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <ListMusic className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold">Emma Thompson</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Playlist Curator</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-balance px-2">
            Ready to Start Your Musical Journey?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-primary-foreground/90 text-pretty px-4">
            Join thousands of music lovers and artists already using Harmoniq to discover, create, and share amazing
            music.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
              asChild
            >
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Music className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <span className="text-lg sm:text-xl font-bold">Harmoniq</span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Your music streaming experience, reimagined for the modern world.
              </p>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Product</h4>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                <li>
                  <Link href="/features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-foreground transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Company</h4>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Support</h4>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm sm:text-base text-muted-foreground">
            <p>&copy; 2024 Harmoniq. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
