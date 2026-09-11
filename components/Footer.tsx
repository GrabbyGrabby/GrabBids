"use client";

export default function Footer() {
  return (
    <footer className="px-4 py-12 border-t border-black/6 bg-[#fbf8f3]">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-[#17191d]">
              Grab<span className="text-[#1b5e48]">Bids</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs font-semibold text-[#6b7280]">
            <a href="#leaderboard" className="hover:text-[#17191d] transition-colors">
              Leaderboard
            </a>
            <a href="#how-it-works" className="hover:text-[#17191d] transition-colors">
              How it works
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#17191d] transition-colors"
            >
              Community
            </a>
          </div>

          {/* Copyright */}
          <span className="text-[11px] font-semibold text-[#9ca3af] tracking-wider">
            © {new Date().getFullYear()} GrabBids • Community Ranked
          </span>
        </div>
      </div>
    </footer>
  );
}
