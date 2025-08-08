import React, { useState } from "react";

const helplines = [
  { category: "Emergency", label: "Police", number: "100" },
  { category: "Emergency", label: "Fire", number: "101" },
  { category: "Emergency", label: "Ambulance", number: "108" },
  { category: "Government", label: "CM Helpline", number: "1800-222-111" },
  { category: "Utilities", label: "Electricity", number: "1912" },
  { category: "COVID-19", label: "COVID-19 Helpline", number: "020-26127394" },
  { category: "Women/Child", label: "Women Helpline", number: "1091" },
  { category: "Senior Citizens", label: "Senior Citizen Helpline", number: "1291" },
  // Add more as needed
];

const categories = [
  "All",
  ...Array.from(new Set(helplines.map((h) => h.category))),
];

export default function MaharashtraHelplinePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = helplines.filter(
    (h) =>
      (filter === "All" || h.category === filter) &&
      (h.label.toLowerCase().includes(search.toLowerCase()) ||
        h.number.includes(search))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <img
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=80&fit=crop"
            alt="Maharashtra"
            className="rounded-xl shadow w-32 h-20 object-cover"
          />
          <div>
            <h1 className="text-3xl font-extrabold text-orange-700 mb-1">
              Maharashtra Helpline Directory
            </h1>
            <p className="text-gray-600">
              All important and emergency numbers for Maharashtra, always up to date.
            </p>
          </div>
        </div>

        {/* Highlighted Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {helplines
            .filter((h) =>
              ["Police", "Ambulance", "CM Helpline"].includes(h.label)
            )
            .map((h) => (
              <div
                key={h.label}
                className="bg-orange-100 rounded-xl p-4 flex flex-col items-center shadow"
              >
                <span className="text-lg font-bold text-orange-700">
                  {h.label}
                </span>
                <span className="text-2xl font-mono text-gray-900">
                  {h.number}
                </span>
              </div>
            ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search helpline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-orange-200 shadow"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-orange-200 shadow"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Helpline Table */}
        <div className="bg-white/80 rounded-xl shadow-lg p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="text-orange-700">
                <th className="py-2">Category</th>
                <th className="py-2">Service</th>
                <th className="py-2">Number</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">
                    No results found.
                  </td>
                </tr>
              ) : (
                filtered.map((h) => (
                  <tr key={h.label + h.number} className="even:bg-orange-50">
                    <td className="py-2">{h.category}</td>
                    <td className="py-2">{h.label}</td>
                    <td className="py-2 font-mono">{h.number}</td>
                    <td>
                      <button
                        className="text-orange-600 hover:underline"
                        onClick={() => navigator.clipboard.writeText(h.number)}
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 