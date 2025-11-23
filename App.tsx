import React, { useState, useRef, useCallback } from 'react';
import { generateStockMetadata } from './services/geminiService';
import { StockMetadata, LoadingState } from './types';
import { MetadataDisplay } from './components/MetadataDisplay';
import { UploadCloudIcon, SparklesIcon, ImageIcon, TrashIcon } from './components/Icons';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<StockMetadata | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    // Reset state
    setStatus(LoadingState.IDLE);
    setMetadata(null);
    setErrorMsg(null);

    // Create preview
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleGenerate = async () => {
    if (!file) return;

    setStatus(LoadingState.ANALYZING);
    setErrorMsg(null);

    try {
      const result = await generateStockMetadata(file);
      setMetadata(result);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
      setErrorMsg("Gagal menganalisis gambar. Pastikan API Key valid atau coba gambar lain.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setMetadata(null);
    setStatus(LoadingState.IDLE);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Check if loading
  const isLoading = status === LoadingState.ANALYZING;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <SparklesIcon className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              Microstock<span className="font-light text-slate-600">Tag.AI</span>
            </h1>
          </div>
          <div className="text-xs font-medium text-slate-500 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload & Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                Upload Gambar
              </h2>
              
              {!previewUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group min-h-[300px]"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect}
                  />
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloudIcon className="w-8 h-8" />
                  </div>
                  <p className="text-slate-900 font-medium mb-1">Klik untuk pilih gambar</p>
                  <p className="text-slate-500 text-sm">Format JPG, PNG (Max 5MB)</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-auto max-h-[400px] object-contain mx-auto" 
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={handleReset}
                        disabled={isLoading}
                        className="bg-white/90 hover:bg-red-50 text-red-600 p-2 rounded-lg shadow-sm border border-red-100 backdrop-blur-sm"
                        title="Hapus gambar"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleGenerate}
                      disabled={isLoading || status === LoadingState.SUCCESS}
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-all
                        ${isLoading 
                          ? 'bg-slate-400 cursor-not-allowed' 
                          : status === LoadingState.SUCCESS
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5'
                        }`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sedang Menganalisis...
                        </>
                      ) : status === LoadingState.SUCCESS ? (
                        <>
                           <SparklesIcon className="w-5 h-5" />
                           Analisis Selesai (Generate Ulang)
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-5 h-5" />
                          Generate Metadata
                        </>
                      )}
                    </button>
                    
                    {status === LoadingState.SUCCESS && (
                       <button 
                        onClick={handleGenerate} 
                        className="text-xs text-slate-500 underline hover:text-blue-600 text-center"
                       >
                         Generate ulang dengan variasi baru
                       </button>
                    )}
                  </div>
                </div>
              )}
              
              {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}
            </div>
            
            {/* Tips Card */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
              <h3 className="font-semibold text-blue-800 mb-2 text-sm">Cara Menggunakan</h3>
              <ul className="text-sm text-blue-700 space-y-1.5 list-disc list-inside">
                <li>Upload foto terbaik Anda.</li>
                <li>Klik "Generate Metadata".</li>
                <li>AI akan membuat Judul & Keyword dalam Bahasa Inggris (Wajib untuk Shutterstock/Adobe Stock).</li>
                <li>Salin dan tempel ke platform microstock.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            {metadata ? (
              <MetadataDisplay data={metadata} />
            ) : (
              <div className="h-full min-h-[400px] bg-white rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <SparklesIcon className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">Belum ada hasil analisis</h3>
                <p className="text-slate-500 max-w-md">
                  Upload gambar dan klik tombol generate untuk melihat judul dan kata kunci yang dioptimalkan untuk SEO Microstock.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;