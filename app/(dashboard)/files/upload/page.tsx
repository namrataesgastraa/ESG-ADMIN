'use client';

import { BrandLine } from "@/components/BrandLine";
import { UploadCloud, FileText } from "lucide-react";

export default function UploadFile() {
  return (
    <div className="max-w-4xl space-y-10">

      {/* Header */}
      <div className="flex items-center gap-4">
        <BrandLine />

        <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">
          Upload Documentation
        </h1>
      </div>


      {/* Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 space-y-8">

        {/* Upload Area */}
        <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-astraa-violet transition cursor-pointer">

          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <UploadCloud size={26} className="text-gray-600" />
          </div>

          <p className="text-sm font-semibold text-astraa-dark">
            Click or drag file to upload
          </p>

          <p className="text-xs text-gray-500 mt-1">
            PDF, DOC, JPG, PNG, XLSX • Max size 25MB
          </p>

          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

        </div>


        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-8">

          {/* File Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              File Title
            </label>

            <input
              type="text"
              placeholder="Q1 Emission Summary"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-astraa-violet focus:ring-1 focus:ring-astraa-violet outline-none transition"
            />
          </div>


          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Category
            </label>

            <select
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-astraa-violet focus:ring-1 focus:ring-astraa-violet outline-none transition cursor-pointer"
            >
              <option>Environmental</option>
              <option>Social</option>
              <option>Governance</option>
            </select>
          </div>

        </div>


        {/* Description */}
        <div className="space-y-2">

          <label className="text-sm font-semibold text-gray-700">
            File Description (Optional)
          </label>

          <textarea
            rows={4}
            placeholder="Briefly describe the document contents..."
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-astraa-violet focus:ring-1 focus:ring-astraa-violet outline-none transition"
          />

        </div>


        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">

          <button className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>

          <button className="flex items-center gap-2 px-6 py-2.5 bg-astraa-violet text-white rounded-lg text-sm font-semibold hover:opacity-90 transition">
            <FileText size={16} />
            Upload File
          </button>

        </div>

      </div>

    </div>
  );
}