import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const examType = searchParams.get('examType');
  const year = searchParams.get('year');
  const type = searchParams.get('type');
  const level = searchParams.get('level'); // dla matury

  if (!examType || !year || !type) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    let folderPath;
    
    if (examType === 'egzamin-8') {
      folderPath = join(process.cwd(), 'public', 'math_resources', 'egzamin-8', year, type);
    } else if (examType === 'matura' && level) {
      folderPath = join(process.cwd(), 'public', 'math_resources', 'matura', level, year, type);
    } else {
      return NextResponse.json({ error: 'Invalid examType or missing level' }, { status: 400 });
    }

    const files = await readdir(folderPath);
    
    // Filtruj tylko pliki PNG i wyciągnij numery zadań
    const imageFiles = files.filter(file => file.endsWith('.png') && !file.includes('-solution-'));
    const problemImages = imageFiles
      .map(file => {
        const match = file.match(/^(\d+)\.png$/);
        return match ? parseInt(match[1]) : null;
      })
      .filter(num => num !== null)
      .sort((a, b) => a! - b!);

    // Znajdź obrazy rozwiązań
    const solutionFiles = files.filter(file => file.includes('-solution-') && file.endsWith('.png'));
    const solutionImages: Record<number, number[]> = {};
    
    solutionFiles.forEach(file => {
      const match = file.match(/^(\d+)-solution-(\d+)\.png$/);
      if (match) {
        const problemId = parseInt(match[1]);
        const solutionIndex = parseInt(match[2]);
        if (!solutionImages[problemId]) {
          solutionImages[problemId] = [];
        }
        solutionImages[problemId].push(solutionIndex);
      }
    });

    // Posortuj indeksy rozwiązań
    Object.keys(solutionImages).forEach(key => {
      solutionImages[parseInt(key)].sort((a, b) => a - b);
    });

    return NextResponse.json({
      problemImages,
      solutionImages,
      scannedPath: folderPath.replace(process.cwd(), ''),
      totalFiles: files.length
    });

  } catch (error) {
    console.error('Error scanning images:', error);
    return NextResponse.json({ 
      problemImages: [], 
      solutionImages: {},
      error: 'Failed to scan directory' 
    }, { status: 200 }); // Zwróć 200 żeby nie crashować aplikacji
  }
}