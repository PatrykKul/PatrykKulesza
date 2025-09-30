import ExamPage from '@/app/matematyka/components/ExamPage';
import { examData } from './examData';
import { notFound } from 'next/navigation';

export default async function MaturaExamPage({ 
  params 
}: { 
  params: Promise<{ level: string; year: string; type: string }> 
}) {
  const { level, year, type } = await params;
  const examInfo = examData[level]?.[year]?.[type];
  
  if (!examInfo) {
    notFound();
  }

  return (
    <ExamPage
      examData={examInfo}
      year={year}
      type={type}
      examType="matura"
      level={level}
      basePath="/matematyka"
    />
  );
}