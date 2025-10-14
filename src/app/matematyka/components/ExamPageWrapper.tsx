'use client';

import ExamPage from './ExamPage';
import { ExamData } from './ExamPage';

interface ExamPageWrapperProps {
  examData: ExamData;
  year: string;
  type: string;
  examType?: string;
  basePath?: string;
  level?: string;
}

export default function ExamPageWrapper(props: ExamPageWrapperProps) {
  return <ExamPage {...props} />;
}
