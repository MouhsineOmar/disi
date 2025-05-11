import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import animationData from "@/components/animations/default-animation.json"; // Assuming a placeholder animation

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-64 h-64 mb-8">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Free Forms</h1>
      <p className="mb-4 text-center">
        This is your Next.js application with Tailwind CSS and Lottie animations.
      </p>
      <p className="mb-8 text-sm text-muted-foreground">
        Powered by omar mouhsine
      </p>
      <Button size="lg">Get Started</Button>
    </main>
  );
}
