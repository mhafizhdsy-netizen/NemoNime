import logoTitle from "@/src/config/logoTitle.js";
import website_name from "@/src/config/website.js";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full mt-20">
      {/* Main Footer Content */}
      <div className="bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] border-t border-white/10">
        <div className="max-w-[1920px] mx-auto px-4 py-12">
          {/* Logo Section */}
          <div className="flex justify-center sm:justify-start items-center gap-6 mb-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#e91e63]/20 to-[#00bcd4]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src="/footer.png"
                alt={logoTitle}
                className="h-[100px] w-[200px] object-contain relative z-10"
              />
            </div>
          </div>

          {/* A-Z List Section */}
          <div className="mb-10 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 items-center sm:items-start">
              <div className="flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-[#e91e63] to-[#00bcd4] rounded-full"></span>
                <h2 className="text-base font-bold text-white">A-Z LIST</h2>
              </div>
              <span className="text-sm text-white/50">Browse anime alphabetically</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {["All", "#", "0-9", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))].map((item, index) => (
                <Link
                  to={`az-list/${item === "All" ? "" : item}`}
                  key={index}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-white/5 to-white/10 hover:from-[#e91e63]/20 hover:to-[#00bcd4]/20 text-white/60 hover:text-white rounded-lg transition-all duration-300 border border-white/5 hover:border-[#e91e63]/30 font-medium"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="flex gap-6 flex-wrap justify-center sm:justify-start mb-10">
            <Link
              to="/about"
              className="text-sm text-white/60 hover:text-white transition-colors font-medium hover:underline decoration-[#e91e63]"
            >
              About Us
            </Link>
            <span className="text-white/20">•</span>
            <Link
              to="/home"
              className="text-sm text-white/60 hover:text-white transition-colors font-medium hover:underline decoration-[#e91e63]"
            >
              Home
            </Link>
            <span className="text-white/20">•</span>
            <Link
              to="/most-popular"
              className="text-sm text-white/60 hover:text-white transition-colors font-medium hover:underline decoration-[#e91e63]"
            >
              Popular Anime
            </Link>
          </div>

          {/* Legal Text */}
          <div className="space-y-4 text-sm text-white/40 text-center sm:text-left border-t border-white/5 pt-8">
            <p className="max-w-4xl mx-auto sm:mx-0 leading-relaxed">
              {website_name} does not host any files, it merely pulls streams from 3rd party services. Legal issues should be taken up with the file hosts and providers. {website_name} is not responsible for any media files shown by the video providers.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[#e91e63]">©</span>
              <span className="font-semibold text-white/60">{website_name}</span>
              <span>•</span>
              <span>All rights reserved</span>
              <span>•</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
