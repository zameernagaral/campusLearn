import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Access the Thank You portal on CampusLearn, your centralized e-learning platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
