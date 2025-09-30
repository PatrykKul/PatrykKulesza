import ExamPage from '@/app/matematyka/components/ExamPage';
import { examData } from './examData';
import { notFound } from 'next/navigation';

export default function MaturaExamPage({ 
  params 
}: { 
  params: { level: string; year: string; type: string } 
}) {
  const examInfo = examData[params.level]?.[params.year]?.[params.type];
  
  if (!examInfo) {
    notFound();
  }

  return (
    <ExamPage
      examData={examInfo}
      year={params.year}
      type={params.type}
      examType="matura"
      level={params.level}
      basePath="/matematyka"
    />
  );
}