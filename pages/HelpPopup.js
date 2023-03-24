import React from 'react';

const HelpPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg w-3/4 md:w-1/2 lg:w-1/3 p-8">
        <h2 className="text-2xl font-bold mb-4">About Next.js Notepad</h2>
        <p>
          This is a simple Next.js-based Notepad application with basic text editing functionality and AI-powered features.
          You can create, open, and save files, as well as utilize AI tools to generate content.
        </p>
        <div className="mt-8 text-right">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpPopup;
