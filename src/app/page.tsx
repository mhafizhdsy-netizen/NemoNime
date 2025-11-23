'use client';

export default function Home() {
  return (
    <div className="pt-16 w-full min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Welcome to NemoNime</h1>
        <p className="text-gray-300 text-lg">Your anime streaming platform</p>
      </div>
    </div>
  );
}

// Disable static generation for this page
export const dynamic = 'force-dynamic';