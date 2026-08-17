import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Analytics',
  description: 'Access the Career Analytics portal on CampusLearn, your centralized e-learning platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
