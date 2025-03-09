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
    <div className="flex flex-wrap items-center justify-center gap-4 w-full">
      {vitals.map((vital, index) => (
        <Card key={index} title={vital.title} unit={vital.unit} value={vital.value} />
      ))}
    </div>
  );
};

export default Cards;
