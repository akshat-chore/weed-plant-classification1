
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultCard } from './components/ResultCard';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import type { WeedClassification } from './types';
import { classifyWeed } from './services/geminiService';
import { XCircleIcon } from './components/icons/XCircleIcon';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<WeedClassification | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    setImageFile(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  const handleClassify = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const classificationResult = await classifyWeed(imageFile);
      setResult(classificationResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during classification.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-secondary tracking-tight">
          Weed ID <span className="text-primary">Pro</span>
        </h1>
        <p className="mt-2 text-lg text-text-secondary">
          Upload a plant image to get an AI-powered classification and management advice.
        </p>
      </header>

      <main className="w-full max-w-4xl flex-grow">
        <div className="bg-card shadow-lg rounded-2xl p-6 md:p-8">
          {!imageUrl ? (
            <ImageUploader onImageUpload={handleImageUpload} />
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md mb-6">
                <img src={imageUrl} alt="Uploaded plant" className="rounded-xl object-contain w-full h-auto max-h-[50vh] shadow-md" />
                <button
                  onClick={handleClear}
                  className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-lg hover:bg-red-100 transition-colors"
                  aria-label="Remove image"
                >
                  <XCircleIcon className="h-8 w-8 text-red-500" />
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && (
            <div className="text-center mt-6 flex flex-col items-center justify-center">
              <SpinnerIcon className="h-12 w-12 text-primary" />
              <p className="mt-4 text-text-secondary font-medium animate-pulse">Analyzing plant... this may take a moment.</p>
            </div>
          )}

          {result && !isLoading && <ResultCard result={result} />}
        </div>
      </main>

      {imageUrl && !isLoading && (
        <footer className="sticky bottom-0 w-full flex justify-center p-4 mt-8 bg-background/80 backdrop-blur-sm">
           <button
              onClick={handleClassify}
              disabled={isLoading}
              className="w-full max-w-sm flex items-center justify-center gap-3 text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-full text-lg px-8 py-4 text-center transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {result ? 'Re-Classify Plant' : 'Classify Plant'}
            </button>
        </footer>
      )}
    </div>
  );
};

export default App;
