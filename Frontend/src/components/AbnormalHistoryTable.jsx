import React, { useState } from "react";

const AbnormalHistoryTable = ({ abnormalHistory }) => {
  const [expandedVital, setExpandedVital] = useState(null);

  // Group history by vital name
  const groupedHistory = abnormalHistory.reduce((acc, vital) => {
    if (!acc[vital.title]) acc[vital.title] = [];
    acc[vital.title].push(vital);
    return acc;
  }, {});

  return (
    <div className="mt-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">Abnormal Vitals History</h2>
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">Vital</th>
            <th className="border border-gray-400 px-4 py-2">Last Value</th>
            <th className="border border-gray-400 px-4 py-2">Total Occurrences</th>
            <th className="border border-gray-400 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedHistory).map(([title, records], index) => {
            const latestRecord = records[records.length - 1];

            return (
              <React.Fragment key={index}>
                <tr
                  className="text-center cursor-pointer bg-gray-100 hover:bg-gray-200"
                  onClick={() => setExpandedVital(expandedVital === title ? null : title)}
                >
                  <td className="border border-gray-400 px-4 py-2 font-semibold">{title}</td>
                  <td className="border border-gray-400 px-4 py-2">{latestRecord.value} {latestRecord.unit}</td>
                  <td className="border border-gray-400 px-4 py-2">{records.length}</td>
                  <td className="border border-gray-400 px-4 py-2">▼</td>
                </tr>

                {expandedVital === title && (
                  <tr>
                    <td colSpan="4" className="border border-gray-400 p-4 bg-gray-50">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="border border-gray-400 px-4 py-2">Time Detected</th>
                            <th className="border border-gray-400 px-4 py-2">Time Normalized</th>
                            <th className="border border-gray-400 px-4 py-2">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {records.map((record, i) => {
                            const duration = record.normalizedTime !== "-"
                              ? new Date(record.normalizedTime) - new Date(record.time)
                              : "Ongoing";

                            return (
                              <tr key={i} className="text-center">
                                <td className="border border-gray-400 px-4 py-2">{record.time}</td>
                                <td className="border border-gray-400 px-4 py-2">{record.normalizedTime}</td>
                                <td className="border border-gray-400 px-4 py-2">
                                  {duration !== "Ongoing" ? `${(duration / 60000).toFixed(1)} min` : "Ongoing"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AbnormalHistoryTable;
