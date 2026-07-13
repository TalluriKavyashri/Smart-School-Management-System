import { useEffect, useState } from "react";
import api from "../lib/api";
import { FileBarChart2, Search, Trophy, FileSpreadsheet } from "lucide-react";

export default function Results() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [results, setResults] = useState([]);

  const loadExams = async () => {
    const data = await api.get("/api/exams");
    setExams(data);
  };

  const loadResults = async () => {
    if (!selectedExam) return;
    const data = await api.get(`/api/exams/${selectedExam}/results`);
    setResults(data);
  };

  useEffect(() => {
    loadExams();
  }, []);

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <FileBarChart2 size={34} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Exam Results</h1>
      </div>

      {/* Select Exam */}
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 shadow-lg">

        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Search size={20} className="text-blue-600" />
          Select Exam
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="px-4 py-3 bg-white/70 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="">Choose exam</option>
            {exams.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name} — {e.className} ({e.subject})
              </option>
            ))}
          </select>

          <button
            className="px-5 py-3 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition flex items-center gap-2"
            onClick={loadResults}
          >
            <FileSpreadsheet size={18} />
            Load Results
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 shadow-lg">

        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-yellow-500" />
          Result Sheet
        </h2>

        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600 border-b">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Roll No</th>
                  <th className="p-3 text-left">Marks</th>
                  <th className="p-3 text-left">Result</th>
                </tr>
              </thead>

              <tbody>
                {results.map((r) => {
                  const pass = r.marks >= 35;
                  return (
                    <tr
                      key={r._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{r.student?.name}</td>
                      <td className="p-3">{r.student?.rollNo}</td>
                      <td className="p-3 font-semibold">{r.marks}</td>

                      <td
                        className={`p-3 font-semibold ${
                          pass ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {pass ? "Pass" : "Fail"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500">No results found</div>
        )}
      </div>
    </div>
  );
}
