import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exam Preparation',
  description: 'Access the Exam Preparation portal on CampusLearn, your centralized e-learning platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
