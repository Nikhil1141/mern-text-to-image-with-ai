import React, { useEffect, useState, useContext, memo } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [history, setHistory] = useState([]);
  const [credits, setCredits] = useState(0);

  const fetchDashboard = async () => {
    try {
      const creditRes = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const historyRes = await axios.get(`${backendUrl}/api/image/image-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCredits(creditRes.data.credits);
      setHistory(historyRes.data.history);
    } catch (error) {
      console.error("Dashboard error:", error.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      <div className="mb-6">
        <span className="text-lg">💰 Current Credits: </span>
        <span className="font-bold text-blue-600">{credits}</span>
      </div>

      <h2 className="text-xl font-semibold mb-3">🖼️ Generated Images</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {history.length === 0 && <p>No images found.</p>}
        {history.map((item) => (
          <div key={item._id} className="border rounded p-3 shadow-sm">
            <img
              src={item.imageUrl}
              alt={item.prompt}
              className="w-full h-48 object-cover rounded"
            />
            <p className="mt-2 text-sm font-medium">Prompt: {item.prompt}</p>
            <p className="text-xs text-gray-500">
              Date: {new Date(item.createdAt).toLocaleString()}
            </p>
            <a
              href={item.imageUrl}
              download={`image-${item._id}.png`}
              className="text-blue-500 text-sm underline mt-1 inline-block"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Dashboard);
