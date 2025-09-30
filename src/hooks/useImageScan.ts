import { useState, useEffect } from 'react';

interface ImageScanResult {
  problemImages: number[];
  solutionImages: Record<number, number[]>;
  scannedPath: string;
  totalFiles: number;
  error?: string;
}

export function useImageScan(examType: string, year: string, type: string, level?: string) {
  const [imageData, setImageData] = useState<ImageScanResult>({
    problemImages: [],
    solutionImages: {},
    scannedPath: '',
    totalFiles: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scanImages = async () => {
      try {
        const params = new URLSearchParams({
          examType,
          year,
          type,
          ...(level && { level })
        });

        const response = await fetch(`/api/scan-images?${params}`);
        const data = await response.json();
        
        setImageData(data);
      } catch (error) {
        console.error('Failed to scan images:', error);
        setImageData({
          problemImages: [],
          solutionImages: {},
          scannedPath: '',
          totalFiles: 0,
          error: 'Failed to load images'
        });
      } finally {
        setLoading(false);
      }
    };

    if (examType && year && type) {
      scanImages();
    }
  }, [examType, year, type, level]);

  return { imageData, loading };
}