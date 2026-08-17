import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiz',
  description: 'Access the Quiz portal on CampusLearn, your centralized e-learning platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
