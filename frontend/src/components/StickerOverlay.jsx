import "./StickerOverlay.css";

export default function StickerOverlay({ stickers }) {
    if (!stickers || stickers.length === 0) return null;

    return (
        <div className="sticker-overlay">
            {stickers.map((sticker) => (
                <div
                    key={sticker.id}
                    className="sticker"
                    style={{ left: `${sticker.x}%`, top: `${sticker.y}%` }}
                    title={sticker.label}
                >
                    <span className="sticker-emoji">{sticker.emoji}</span>
                    <span className="sticker-label">{sticker.label}</span>
                </div>
            ))}
        </div>
    );
}
