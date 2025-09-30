import ExamPage from '@/app/matematyka/components/ExamPage';
import { examData } from './examData';
import { notFound } from 'next/navigation';

export default function Egzamin8ExamPage({ 
  params 
}: { 
  params: { year: string; type: string } 
}) {
  const examInfo = examData[params.year]?.[params.type];
  
  if (!examInfo) {
    notFound();
  }

  return (
    <ExamPage
      examData={examInfo}
      year={params.year}
      type={params.type}
      examType="egzamin-8"
      basePath="/matematyka"
    />
  );
}