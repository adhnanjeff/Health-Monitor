import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader";
import Baby from "../models/Baby";
import Cards from "../components/Cards";
import AbnormalHistoryTable from "../components/AbnormalHistoryTable";

const Home = () => {
  const [abnormalHistory, setAbnormalHistory] = useState([]);
  const [sensorData, setSensorData] = useState({
    spO2: "--",
    bp: "--",
    temp: "--",
  });

  // Function to fetch real-time sensor data from Blynk API
  const fetchSensorData = async () => {
    try {
      const responses = await Promise.all([
        fetch("https://blynk.cloud/external/api/get?token=s0luTzCpMMrIeuiTswIpx1U5qBImH8KT&V0"), // SpO2
        fetch("https://blynk.cloud/external/api/get?token=s0luTzCpMMrIeuiTswIpx1U5qBImH8KT&V1"), // BP
        fetch("https://blynk.cloud/external/api/get?token=s0luTzCpMMrIeuiTswIpx1U5qBImH8KT&V3"), // Temp
      ]);

      const [spO2, bp, temp] = await Promise.all(responses.map(res => res.text()));

      setSensorData({
        spO2: spO2 || "--",
        bp: bp || "--",
        temp: temp || "--",
      });

    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000); // Auto-refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const vitals = [
    { title: "Heart Rate", unit: "BPM", value: 80, normalRange: "60-100 BPM" },
    { title: "Resting Heart Rate", unit: "BPM", value: 65, normalRange: "60-80 BPM" },
    { title: "Blood Oxygen", unit: "%", value: sensorData.spO2, normalRange: "≥ 95%" },
    { title: "Blood Pressure", unit: "mmHg", value: sensorData.bp, normalRange: "120/80 mmHg" },
    { title: "Temperature", unit: "°C", value: sensorData.temp, normalRange: "36-37.5°C" },
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
            case "Temperature":
              return value < 36 || value > 37.5;
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
  }, [sensorData]); // Track changes in sensorData

  return (
    <section className="w-full flex flex-col items-center bg-gray-300 text-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-6">Health Dashboard</h1>
      <p className="text-lg text-center max-w-2xl mb-8">
        This dashboard provides insights into vital health parameters while tracking the status.
      </p>

      <div className="w-full flex flex-col md:flex-row items-center">
        <div className="w-full flex items-center justify-center max-h-[50vh]">
          <Canvas camera={{ near: 0.1, far: 20, position: [0, 1, 5] }} style={{ height: "500px", width: "100%" }}>
            <Suspense fallback={<Loader />}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[2, 5, 5]} intensity={2} />
              <hemisphereLight intensity={0.8} />
              <Baby />
            </Suspense>
          </Canvas>
        </div>
      </div>

      <Cards vitals={vitals} />

      {abnormalHistory.length > 0 && (
        <div className="mt-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">Abnormal Vitals History</h2>
          {abnormalHistory.length > 0 && <AbnormalHistoryTable abnormalHistory={abnormalHistory} />}
          
        </div>
      )}
    </section>
  );
};

export default Home;
