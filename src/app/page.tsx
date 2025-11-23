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
          NemoNime
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Free Anime Streaming Platform
        </p>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">🚀 Features</h2>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li>✅ HD Anime Streaming</li>
              <li>✅ English Subtitles & Dub</li>
              <li>✅ Real-time Notifications</li>
              <li>✅ Mobile Responsive</li>
              <li>✅ No Ads</li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">🔧 Status</h2>
            <p className="text-muted-foreground">
              Platform is currently under development. Check back soon for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}