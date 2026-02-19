export default function Footer() {
  return (
    <footer className="border-t border-ci-gray-300/50 py-6 mt-12">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-ci-gray-500">
          <span className="text-xs">Powered by</span>
          <span className="text-xs font-semibold" style={{ color: '#4FB573' }}>
            Regen Network
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#4FB573" strokeWidth="2" />
            <path
              d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4"
              stroke="#4FB573"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="1.5" fill="#4FB573" />
          </svg>
        </div>
        <div className="text-[10px] text-ci-gray-300">
          Conservation International &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
