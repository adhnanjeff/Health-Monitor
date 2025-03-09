import React from "react";

const getStatusColor = (title, value) => {
  if (value === "--") return "text-gray-400"; // No data case

  switch (title) {
    case "Heart Rate":
      return value >= 60 && value <= 100 ? "text-green-500" : "text-red-500";
    case "Resting Heart Rate":
      return value >= 60 && value <= 80 ? "text-green-500" : "text-red-500";
    case "Blood Oxygen":
      return value >= 95 ? "text-green-500" : "text-red-500";
    case "Blood Pressure":
      return value === "120/80" ? "text-green-500" : "text-red-500";
    case "Blood Glucose":
      return value >= 4.0 && value <= 7.8 ? "text-green-500" : "text-red-500";
    case "Sleep Monitoring":
      return value >= 6 && value <= 9 ? "text-green-500" : "text-red-500";
    default:
      return "text-white";
  }
};

const Card = ({ title, unit, value = "--" }) => (
  <div className="bg-gray-800 text-white p-4 rounded-lg w-full md:w-[45%] lg:w-[30%] h-28 flex flex-col justify-center items-center shadow-lg">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className={`text-xl font-bold ${getStatusColor(title, value)}`}>
      {value} {unit}
    </p>
    {value === "--" && <span className="text-gray-400 text-sm">NO DATA</span>}
  </div>
);

const Cards = ({ vitals }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {vitals.map((vital, index) => {
        // Convert value to number if it's not already
        const numValue = parseFloat(vital.value);
        let isAbnormal = false;

        // Determine if the value is abnormal
        switch (vital.title) {
          case "Heart Rate":
            isAbnormal = numValue < 60 || numValue > 100;
            break;
          case "Resting Heart Rate":
            isAbnormal = numValue < 60 || numValue > 80;
            break;
          case "Blood Oxygen":
            isAbnormal = numValue < 95;
            break;
          case "Blood Pressure":
            isAbnormal = vital.value !== "120/80";
            break;
          case "Temperature":
            isAbnormal = numValue < 36 || numValue > 37.5;
            break;
          case "Sleep Monitoring":
            isAbnormal = numValue < 6 || numValue > 9;
            break;
          default:
            break;
        }

        return (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-md transition duration-300 ${
              isAbnormal ? "bg-red-500 text-white" : "bg-white"
            }`}
          >
            <h3 className="text-xl font-bold">{vital.title}</h3>
            <p className="text-2xl">{vital.value || "--"} {vital.unit}</p>
            <p className="text-gray-700">{vital.normalRange}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
