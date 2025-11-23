export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="w-24 h-24 mx-auto">
          <img
            src="/favicon.png"
            alt="NemoNime Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-foreground">
          NemoNime - Testing Build
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Testing build configuration...
        </p>
      </div>
    </div>
  );
}