import React, { useState } from 'react';
import { StockMetadata } from '../types';
import { CopyIcon, CheckIcon } from './Icons';

interface MetadataDisplayProps {
  data: StockMetadata;
}

const CopyButton = ({ text, label }: { text: string, label?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
        copied 
          ? 'bg-green-100 text-green-700 border border-green-200' 
          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200'
      }`}
    >
      {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
      {copied ? 'Disalin!' : (label || 'Salin')}
    </button>
  );
};

export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ data }) => {
  // Combine keywords for "Copy All" functionality
  const allKeywords = data.keywords.join(', ');

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Hasil Analisis AI</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
            {data.category}
          </span>
        </div>
        
        <div className="p-5 space-y-6">
          {/* Title Section */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Judul (Title)</label>
              <CopyButton text={data.title} />
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-slate-800 border border-slate-200 text-sm leading-relaxed">
              {data.title}
            </div>
          </div>

           {/* Description Section */}
           <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi (Description)</label>
              <CopyButton text={data.description} />
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-slate-800 border border-slate-200 text-sm leading-relaxed">
              {data.description}
            </div>
          </div>

          {/* Keywords Section */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kata Kunci ({data.keywords.length})</label>
              </div>
              <CopyButton text={allKeywords} label="Salin Semua" />
            </div>
            
            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-1">
              {data.keywords.map((keyword, index) => (
                <div 
                  key={index} 
                  className="group flex items-center bg-white border border-slate-200 rounded-full pl-3 pr-2 py-1 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <span className="text-sm text-slate-700 mr-2">{keyword}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(keyword)}
                    className="text-slate-400 hover:text-blue-600 p-0.5 rounded-full hover:bg-blue-50"
                    title="Salin kata ini"
                  >
                    <CopyIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">
                <div className="text-xs text-slate-400 bg-slate-50 p-2 rounded border border-slate-100">
                 💡 Tip: Metadata dihasilkan dalam Bahasa Inggris sesuai standar situs Microstock global (Shutterstock, Adobe Stock, dll).
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};