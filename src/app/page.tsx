// src/app/page.tsx
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SplineClient from "@/components/SplineClient";

export default function Home() {
  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {/* Background Spline Scene with blur effect */}
      <div className="absolute inset-0 -z-10 backdrop-blur-[2px]">
        <SplineClient />
      </div>

      {/* Enhanced Gradient Overlay with transparency */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent 
        via-background/30 to-background/50 backdrop-filter backdrop-blur-sm"
      />

      {/* Main Content with increased transparency and blur */}
      <Card className="relative z-10 w-[90%] max-w-lg mx-auto bg-white/20 
        backdrop-blur-md border-none shadow-xl hover:bg-white/30 transition-all 
        duration-300 ease-in-out">
        <CardContent className="p-4 sm:p-6 text-center">
          <div className="space-y-1 mb-4 backdrop-blur-none">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight 
              bg-gradient-to-r from-primary to-primary-foreground 
              bg-clip-text text-transparent">
              She Health
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground/90">
              Next Gen Personalized Wellness
            </p>
            <p className="text-base sm:text-lg font-light text-foreground/80">
              Just For Her
            </p>
          </div>

          <div className="flex flex-row gap-3 justify-center my-3">
            <Button 
              asChild 
              size="default" 
              variant="default" 
              className="flex-1 max-w-[120px] bg-primary/80 backdrop-blur-sm 
                hover:bg-primary/90 transition-all"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button 
              asChild 
              size="default" 
              variant="outline" 
              className="flex-1 max-w-[120px] bg-white/30 backdrop-blur-sm 
                hover:bg-white/40 transition-all"
            >
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <FeatureCard title="AI-Powered" description="Personalized health insights" />
            <FeatureCard title="Holistic Care" description="Complete wellness tracking" />
            <FeatureCard title="Smart Connect" description="Device integration" />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 
      transition-all duration-300 ease-in-out">
      <h3 className="font-semibold text-sm sm:text-base text-foreground/90">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground/80">{description}</p>
    </div>
  );
}
