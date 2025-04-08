import React from 'react';

const EntityNewsPopup = ({ entity, news }) => {
    return (
        <div className="absolute top-4 left-4 z-50 p-4 bg-white shadow-xl rounded-lg max-w-md border border-gray-200">
            <h2 className="font-semibold text-lg mb-2">Новости по: <span className="text-blue-600">{entity.name}</span></h2>
            {news.length > 0 ? (
                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {news.map((n, index) => (
                        <li key={index} className="border-b pb-2">
                            <p className="text-sm font-semibold">{n.title}</p>
                            <p className="text-xs text-gray-700">{n.text}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{new Date(n.time).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">Нет связанных новостей.</p>
            )}
        </div>
    );
};

export default EntityNewsPopup;
