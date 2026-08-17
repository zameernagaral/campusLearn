import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Roadmap',
  description: 'Access the Career Roadmap portal on CampusLearn, your centralized e-learning platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
