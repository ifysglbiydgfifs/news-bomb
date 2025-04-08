const DigestPopup = ({
                         content,
                         summary,
                         onClose,
                         onSpeak,
                         onPause,
                         onResume,
                         onStop,
                         isSpeaking,
                         isPaused
                     }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Дайджест</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                <div className="text-sm text-gray-800 space-y-4">
                    <p><strong>{content}</strong></p>
                    <p>{summary}</p>
                    <div className="flex space-x-2 mt-4">
                        {!isSpeaking && (
                            <button
                                onClick={onSpeak}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                🔊 Озвучить
                            </button>
                        )}
                        {isSpeaking && !isPaused && (
                            <button
                                onClick={onPause}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                            >
                                ⏸ Пауза
                            </button>
                        )}
                        {isSpeaking && isPaused && (
                            <button
                                onClick={onResume}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                                ▶ Продолжить
                            </button>
                        )}
                        {isSpeaking && (
                            <button
                                onClick={onStop}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                ⏹ Стоп
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DigestPopup;