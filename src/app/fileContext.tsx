import React, { createContext, useState, useContext, useEffect } from 'react';

interface FileData {
  id: number;
  file: string;
}

interface FileContextType {
  uploadHistory: FileData[];
  fetchFiles: () => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadHistory, setUploadHistory] = useState<FileData[]>([]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/files/');
      const data: FileData[] = await response.json();
      setUploadHistory(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <FileContext.Provider value={{ uploadHistory, fetchFiles }}>
      {children}
    </FileContext.Provider>
  );
};