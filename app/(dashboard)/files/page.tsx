'use client';

import { BrandLine } from "@/components/BrandLine";
import Link from "next/link";
import { FileText, FileSpreadsheet, File, Download, Trash2, Upload } from "lucide-react";

const files = [
  { id: 1, name: "GHG_Scope3_Report_2026.pdf", type: "PDF", owner: "John Doe", date: "2026-04-02", category: "Environmental" },
  { id: 2, name: "Board_Diversity_Matrix.xlsx", type: "Excel", owner: "Senior Dev", date: "2026-03-28", category: "Governance" },
  { id: 3, name: "Supply_Chain_Code_of_Conduct.docx", type: "Doc", owner: "Manager", date: "2026-03-25", category: "Social" },
];

function getFileIcon(type: string) {
  if (type === "PDF") return <FileText size={18} className="text-red-500" />;
  if (type === "Excel") return <FileSpreadsheet size={18} className="text-green-600" />;
  return <File size={18} className="text-gray-500" />;
}

export default function FileVault() {
  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-4">
          <BrandLine />

          <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">
            File Vault
          </h1>
        </div>

        <Link href="/files/upload">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-astraa-violet text-white rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-sm">
            <Upload size={16} />
            Upload File
          </button>
        </Link>

      </div>


      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

        <table className="w-full">

          {/* Header */}
          <thead className="border-b border-gray-200">
            <tr className="text-sm text-gray-500 font-semibold">
              <th className="px-8 py-4 text-left">File</th>
              <th className="px-8 py-4 text-left">Category</th>
              <th className="px-8 py-4 text-left">Uploaded By</th>
              <th className="px-8 py-4 text-left">Date</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>


          {/* Body */}
          <tbody className="divide-y divide-gray-100">

            {files.map((file) => (

              <tr key={file.id} className="hover:bg-gray-50 transition">

                {/* File Name */}
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100">
                      {getFileIcon(file.type)}
                    </div>

                    <span className="text-sm font-medium text-astraa-dark">
                      {file.name}
                    </span>

                  </div>
                </td>


                {/* Category */}
                <td className="px-8 py-5">

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      file.category === "Environmental"
                        ? "bg-green-50 text-green-700"
                        : file.category === "Social"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    {file.category}
                  </span>

                </td>


                {/* Owner */}
                <td className="px-8 py-5 text-sm text-gray-600">
                  {file.owner}
                </td>


                {/* Date */}
                <td className="px-8 py-5 text-sm text-gray-500">
                  {file.date}
                </td>


                {/* Actions */}
                <td className="px-8 py-5">

                  <div className="flex justify-end gap-4">

                    <button className="text-gray-500 hover:text-astraa-violet transition">
                      <Download size={18} />
                    </button>

                    <button className="text-gray-500 hover:text-red-500 transition">
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}