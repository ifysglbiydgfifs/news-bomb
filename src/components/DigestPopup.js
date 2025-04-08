import React from 'react';

const DigestPopup = ({ post, onClose }) => {
    const handleSpeak = () => {
        const synth = window.speechSynthesis;
        const text = `Дайджест по теме ${post.type}. ${post.summary || "Нет краткого описания."}`;
        const utterance = new SpeechSynthesisUtterance(text);
        synth.cancel(); // отменить любые предыдущие речи
        synth.speak(utterance);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Дайджест</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                <div className="text-sm text-gray-800 space-y-4">
                    <p>Здесь будет отображаться дайджест по теме: <strong>{post.type}</strong></p>
                    <p>{post.summary || "Нет краткого описания."}</p>
                    <button
                        onClick={handleSpeak}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        🔊 Озвучить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DigestPopup;
