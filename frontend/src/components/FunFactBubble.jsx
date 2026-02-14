import "./FunFactBubble.css";

export default function FunFactBubble({ fact }) {
    return (
        <div className="fun-fact-bubble">
            <div className="fun-fact-icon">💡</div>
            <div className="fun-fact-content">
                <div className="fun-fact-title">Fun Fact!</div>
                <div className="fun-fact-text">{fact}</div>
            </div>
        </div>
    );
}
