import "./ImageDisplay.css";
import StickerOverlay from "./StickerOverlay";
import FunFactBubble from "./FunFactBubble";

export default function ImageDisplay({ stickers, funFact }) {
    return (
        <div className="image-display">
            <div className="image-container">
                <svg
                    viewBox="0 0 800 600"
                    className="jungle-scene"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Sky gradient */}
                    <defs>
                        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#87CEEB" />
                            <stop offset="100%" stopColor="#E0F7FA" />
                        </linearGradient>
                        <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4CAF50" />
                            <stop offset="100%" stopColor="#2E7D32" />
                        </linearGradient>
                        <radialGradient id="sunGrad">
                            <stop offset="0%" stopColor="#FFF176" />
                            <stop offset="100%" stopColor="#FFD54F" />
                        </radialGradient>
                    </defs>

                    {/* Sky */}
                    <rect width="800" height="600" fill="url(#skyGrad)" />

                    {/* Sun */}
                    <circle cx="680" cy="80" r="50" fill="url(#sunGrad)" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                        <line
                            key={i}
                            x1={680 + 60 * Math.cos((angle * Math.PI) / 180)}
                            y1={80 + 60 * Math.sin((angle * Math.PI) / 180)}
                            x2={680 + 80 * Math.cos((angle * Math.PI) / 180)}
                            y2={80 + 80 * Math.sin((angle * Math.PI) / 180)}
                            stroke="#FFD54F"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    ))}

                    {/* Clouds */}
                    <g className="cloud cloud-1">
                        <ellipse cx="150" cy="60" rx="50" ry="25" fill="white" opacity="0.9" />
                        <ellipse cx="190" cy="50" rx="40" ry="20" fill="white" opacity="0.9" />
                        <ellipse cx="130" cy="50" rx="35" ry="18" fill="white" opacity="0.9" />
                    </g>
                    <g className="cloud cloud-2">
                        <ellipse cx="450" cy="90" rx="45" ry="22" fill="white" opacity="0.85" />
                        <ellipse cx="490" cy="80" rx="35" ry="18" fill="white" opacity="0.85" />
                        <ellipse cx="430" cy="82" rx="30" ry="15" fill="white" opacity="0.85" />
                    </g>

                    {/* Background trees */}
                    <rect x="50" y="200" width="30" height="200" fill="#795548" rx="5" />
                    <ellipse cx="65" cy="190" rx="60" ry="70" fill="#388E3C" />
                    <ellipse cx="65" cy="160" rx="45" ry="50" fill="#43A047" />

                    <rect x="700" y="180" width="28" height="220" fill="#795548" rx="5" />
                    <ellipse cx="714" cy="170" rx="55" ry="65" fill="#388E3C" />
                    <ellipse cx="714" cy="140" rx="40" ry="45" fill="#43A047" />

                    {/* Ground */}
                    <ellipse cx="400" cy="600" rx="500" ry="200" fill="url(#grassGrad)" />

                    {/* Pond */}
                    <ellipse cx="550" cy="470" rx="100" ry="40" fill="#4FC3F7" opacity="0.7" />
                    <ellipse cx="560" cy="465" rx="30" ry="10" fill="white" opacity="0.3" />

                    {/* Vine */}
                    <path d="M 200 100 Q 220 200 180 280 Q 160 330 200 380" stroke="#6D4C41" strokeWidth="6" fill="none" />
                    <ellipse cx="185" cy="230" rx="15" ry="8" fill="#66BB6A" />
                    <ellipse cx="200" cy="280" rx="12" ry="6" fill="#81C784" />

                    {/* Monkey on vine */}
                    <g className="monkey-swing">
                        <circle cx="200" cy="330" r="25" fill="#8D6E63" />
                        <circle cx="200" cy="310" r="18" fill="#A1887F" />
                        <circle cx="193" cy="306" r="3" fill="#3E2723" />
                        <circle cx="207" cy="306" r="3" fill="#3E2723" />
                        <ellipse cx="200" cy="315" rx="8" ry="4" fill="#BCAAA4" />
                        <path d="M 195 318 Q 200 323 205 318" stroke="#3E2723" strokeWidth="2" fill="none" />
                        {/* Arms */}
                        <line x1="182" y1="325" x2="175" y2="300" stroke="#8D6E63" strokeWidth="5" strokeLinecap="round" />
                        <line x1="218" y1="325" x2="225" y2="350" stroke="#8D6E63" strokeWidth="5" strokeLinecap="round" />
                        {/* Tail */}
                        <path d="M 210 355 Q 240 370 230 340 Q 225 320 240 310" stroke="#8D6E63" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </g>

                    {/* Parrot on branch */}
                    <rect x="350" y="200" width="120" height="12" fill="#6D4C41" rx="6" />
                    <g className="parrot-bob">
                        <ellipse cx="420" cy="185" rx="18" ry="22" fill="#E53935" />
                        <ellipse cx="420" cy="170" rx="14" ry="16" fill="#F44336" />
                        <circle cx="416" cy="166" r="3" fill="white" />
                        <circle cx="416" cy="166" r="1.5" fill="#1A237E" />
                        <path d="M 427 168 L 440 165 L 427 172 Z" fill="#FF8F00" />
                        {/* Wing */}
                        <ellipse cx="412" cy="192" rx="14" ry="10" fill="#1E88E5" />
                        <ellipse cx="415" cy="195" rx="10" ry="7" fill="#43A047" />
                        {/* Tail feathers */}
                        <rect x="416" y="205" width="4" height="20" fill="#E53935" rx="2" transform="rotate(-5 418 205)" />
                        <rect x="422" y="205" width="4" height="22" fill="#1E88E5" rx="2" transform="rotate(5 424 205)" />
                        <rect x="410" y="205" width="4" height="18" fill="#FFB300" rx="2" transform="rotate(-10 412 205)" />
                        {/* Crest */}
                        <ellipse cx="425" cy="155" rx="4" ry="10" fill="#FFD600" transform="rotate(15 425 155)" />
                        <ellipse cx="420" cy="153" rx="3" ry="8" fill="#FF8F00" transform="rotate(-5 420 153)" />
                    </g>

                    {/* Baby Elephant */}
                    <g className="elephant-splash">
                        <ellipse cx="520" cy="440" rx="40" ry="30" fill="#90A4AE" />
                        <circle cx="495" cy="415" r="22" fill="#90A4AE" />
                        <circle cx="488" cy="410" r="3" fill="white" />
                        <circle cx="488" cy="410" r="1.5" fill="#263238" />
                        {/* Ears */}
                        <ellipse cx="478" cy="408" rx="12" ry="16" fill="#78909C" />
                        {/* Trunk */}
                        <path d="M 505 420 Q 520 440 510 455 Q 505 462 515 460" stroke="#90A4AE" strokeWidth="8" fill="none" strokeLinecap="round" />
                        {/* Legs */}
                        <rect x="500" y="455" width="10" height="20" fill="#90A4AE" rx="4" />
                        <rect x="520" y="455" width="10" height="20" fill="#90A4AE" rx="4" />
                        <rect x="540" y="455" width="10" height="18" fill="#90A4AE" rx="4" />
                        {/* Water splashes */}
                        <g className="splash-drops">
                            <circle cx="540" cy="445" r="3" fill="#4FC3F7" opacity="0.8" />
                            <circle cx="560" cy="440" r="2" fill="#4FC3F7" opacity="0.6" />
                            <circle cx="530" cy="438" r="2.5" fill="#4FC3F7" opacity="0.7" />
                            <circle cx="555" cy="448" r="2" fill="#4FC3F7" opacity="0.5" />
                        </g>
                    </g>

                    {/* Giraffe peeking */}
                    <g>
                        <rect x="108" y="250" width="16" height="140" fill="#FFA726" rx="8" />
                        {/* Spots on neck */}
                        <circle cx="116" cy="280" r="5" fill="#E65100" opacity="0.5" />
                        <circle cx="112" cy="310" r="4" fill="#E65100" opacity="0.5" />
                        <circle cx="118" cy="340" r="5" fill="#E65100" opacity="0.5" />
                        <ellipse cx="116" cy="245" rx="20" ry="18" fill="#FFA726" />
                        <circle cx="108" cy="240" r="3" fill="white" />
                        <circle cx="108" cy="240" r="1.5" fill="#3E2723" />
                        {/* Ossicones */}
                        <line x1="110" y1="228" x2="106" y2="215" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="106" cy="213" r="3" fill="#8D6E63" />
                        <line x1="122" y1="228" x2="126" y2="215" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="126" cy="213" r="3" fill="#8D6E63" />
                        {/* Smile */}
                        <path d="M 108 250 Q 116 258 124 250" stroke="#3E2723" strokeWidth="1.5" fill="none" />
                    </g>

                    {/* Flowers */}
                    {[
                        { cx: 300, cy: 480, color: "#E91E63" },
                        { cx: 340, cy: 490, color: "#9C27B0" },
                        { cx: 650, cy: 485, color: "#FF5722" },
                        { cx: 180, cy: 495, color: "#FF9800" },
                        { cx: 250, cy: 500, color: "#E91E63" },
                    ].map((f, i) => (
                        <g key={i} className="flower-sway">
                            <line x1={f.cx} y1={f.cy} x2={f.cx} y2={f.cy + 20} stroke="#4CAF50" strokeWidth="2" />
                            {[0, 72, 144, 216, 288].map((angle, j) => (
                                <ellipse
                                    key={j}
                                    cx={f.cx + 8 * Math.cos((angle * Math.PI) / 180)}
                                    cy={f.cy + 8 * Math.sin((angle * Math.PI) / 180)}
                                    rx="5"
                                    ry="8"
                                    fill={f.color}
                                    opacity="0.8"
                                    transform={`rotate(${angle} ${f.cx + 8 * Math.cos((angle * Math.PI) / 180)} ${f.cy + 8 * Math.sin((angle * Math.PI) / 180)})`}
                                />
                            ))}
                            <circle cx={f.cx} cy={f.cy} r="4" fill="#FDD835" />
                        </g>
                    ))}

                    {/* Butterflies */}
                    <g className="butterfly-1">
                        <ellipse cx="320" cy="150" rx="10" ry="7" fill="#E040FB" opacity="0.8" transform="rotate(-20 320 150)" />
                        <ellipse cx="340" cy="150" rx="10" ry="7" fill="#E040FB" opacity="0.8" transform="rotate(20 340 150)" />
                        <line x1="330" y1="145" x2="330" y2="160" stroke="#4A148C" strokeWidth="1.5" />
                    </g>
                    <g className="butterfly-2">
                        <ellipse cx="600" cy="200" rx="8" ry="5" fill="#FFAB40" opacity="0.8" transform="rotate(-20 600 200)" />
                        <ellipse cx="616" cy="200" rx="8" ry="5" fill="#FFAB40" opacity="0.8" transform="rotate(20 616 200)" />
                        <line x1="608" y1="195" x2="608" y2="208" stroke="#E65100" strokeWidth="1.5" />
                    </g>
                </svg>

                <StickerOverlay stickers={stickers} />
                {funFact && <FunFactBubble fact={funFact} />}
            </div>
        </div>
    );
}
