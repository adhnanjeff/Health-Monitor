import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader";
import Baby from "../models/Baby";
import Cards from "../components/Cards";

const Home = () => {
  const [abnormalHistory, setAbnormalHistory] = useState([]);

  const vitals = [
    { title: "Heart Rate", unit: "BPM", value: 200, normalRange: "60-100 BPM" },
    { title: "Resting Heart Rate", unit: "BPM", value: 65, normalRange: "60-80 BPM" },
    { title: "Blood Oxygen", unit: "%", value: 96, normalRange: "≥ 95%" },
    { title: "Blood Pressure", unit: "mmHg", value: "120/80", normalRange: "120/80 mmHg" },
    { title: "Blood Glucose", unit: "mmol/L", value: 5.5, normalRange: "4.0-7.8 mmol/L" },
    { title: "Sleep Monitoring", unit: "hrs", value: 7.5, normalRange: "6-9 hrs" },
  ];

  useEffect(() => {
    const now = new Date().toLocaleTimeString();

    setAbnormalHistory((prevHistory) => {
      return vitals.map(({ title, unit, value, normalRange }) => {
        let status = "Normal";
        let prevEntry = prevHistory.find((entry) => entry.title === title);

        const isAbnormal = (() => {
          switch (title) {
            case "Heart Rate":
              return value < 60 || value > 100;
            case "Resting Heart Rate":
              return value < 60 || value > 80;
            case "Blood Oxygen":
              return value < 95;
            case "Blood Pressure":
              return value !== "120/80";
            case "Blood Glucose":
              return value < 4.0 || value > 7.8;
            case "Sleep Monitoring":
              return value < 6 || value > 9;
            default:
              return false;
          }
        })();

        if (isAbnormal) {
          if (!prevEntry || prevEntry.status !== "Abnormal") {
            return { title, value, unit, status: "Abnormal", time: now, normalizedTime: "-" };
          }
          return prevEntry; // Keep the original abnormal time
        } else {
          if (prevEntry && prevEntry.status === "Abnormal") {
            return { ...prevEntry, status: "Normal", normalizedTime: now };
          }
        }
        return prevEntry || null;
      }).filter(Boolean);
    });
  }, []);

  return (
    <section className="w-full flex flex-col items-center bg-gray-300 text-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-6">Health Dashboard</h1>
      <p className="text-lg text-center max-w-2xl mb-8">
        This dashboard provides insights into vital health parameters while tracking the status. Stay informed and monitor key metrics in real time.
      </p>

      <div className="w-full flex flex-col md:flex-row items-center">
        <div className="w-full flex items-center justify-center max-h-[50vh]">
        <Canvas
          camera={{ near: 0.1, far: 20, position: [0, 1, 5] }} // Adjusted for better visibility
          style={{ height: "500px", width: "100%" }}
        >
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[2, 5, 5]} intensity={2} />
            <hemisphereLight intensity={0.8} />
            
            <Baby />
          </Suspense>
        </Canvas>
        </div>

        <div className="w-full flex flex-wrap md:flex-row justify-center gap-2 mt-[-10px]">
          <Cards vitals={vitals} />
        </div>
      </div>

      {/* Abnormal Vitals Table */}
      {abnormalHistory.length > 0 && (
        <div className="mt-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">Abnormal Vitals History</h2>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">Vital</th>
                <th className="border border-gray-400 px-4 py-2">Value</th>
                <th className="border border-gray-400 px-4 py-2">Status</th>
                <th className="border border-gray-400 px-4 py-2">Time Detected</th>
                <th className="border border-gray-400 px-4 py-2">Time Normalized</th>
              </tr>
            </thead>
            <tbody>
              {abnormalHistory
                .filter(vital => vital.status === "Abnormal" || vital.normalizedTime !== "-")
                .map((vital, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-400 px-4 py-2">{vital.title}</td>
                    <td className="border border-gray-400 px-4 py-2">{vital.value} {vital.unit}</td>
                    <td className={`border border-gray-400 px-4 py-2 font-semibold ${vital.status === "Abnormal" ? "text-red-600" : "text-green-600"}`}>
                      {vital.status}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">{vital.time}</td>
                    <td className="border border-gray-400 px-4 py-2">{vital.normalizedTime}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Normal Vitals Description */}
      <div className="mt-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Normal Ranges</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li><strong>Heart Rate:</strong> 60-100 BPM</li>
          <li><strong>Resting Heart Rate:</strong> 60-80 BPM</li>
          <li><strong>Blood Oxygen:</strong> ≥ 95%</li>
          <li><strong>Blood Pressure:</strong> 120/80 mmHg</li>
          <li><strong>Blood Glucose:</strong> 4.0-7.8 mmol/L</li>
          <li><strong>Sleep Monitoring:</strong> 6-9 hrs</li>
        </ul>
      </div>
    </section>
  );
};

export default Home;
