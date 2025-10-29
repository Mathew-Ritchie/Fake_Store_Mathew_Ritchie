import { useState, useEffect } from "react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(true);

  // Optional: prevent scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-800/50 flex justify-center items-center z-50">
      <div className="w-3/4 max-w-3xl h-3/4 bg-gray-800 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between overflow-auto">
        <div>
          <h1 className="text-2xl font-bold mb-4 text-center">Welcome to My Fake-Store.com</h1>
          <p className="mb-3">
            I built this full-stack web app to practice and gain experience working with a mix of
            modern web technologies. The frontend consumes data from FakeStoreAPI.com to display
            store items, while the backend, built with Express.js, handles user registration, login,
            and manages cart and favourites storage using a SQLite database.
          </p>
          <div className="flex flex-col sm:flex-row justify-center  items-start gap-10">
            {" "}
            <div>
              <p className="font-extrabold">Frontend:</p>
              <ul className="list-disc list-inside mb-3">
                <li>JavaScript</li>
                <li>React.js</li>
                <li>Tailwind CSS</li>
                <li>Zustand (state management)</li>
                <li>Hosted on Netlify</li>
              </ul>
            </div>
            <div>
              {" "}
              <p className="font-extrabold">Backend:</p>
              <ul className="list-disc list-inside">
                <li>Express.js</li>
                <li>SQLite</li>
                <li>Hosted on Render</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
