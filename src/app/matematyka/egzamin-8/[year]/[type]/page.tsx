import ExamPage from '@/app/matematyka/components/ExamPage';
import { examData } from './examData';
import { notFound } from 'next/navigation';

export default async function Egzamin8ExamPage({ 
  params 
}: { 
  params: Promise<{ year: string; type: string }> 
}) {
  const { year, type } = await params;
  const examInfo = examData[year]?.[type];
  
  if (!examInfo) {
    notFound();
  }

  return (
    <ExamPage
      examData={examInfo}
      year={year}
      type={type}
      examType="egzamin-8"
      basePath="/matematyka"
    />
  );
}