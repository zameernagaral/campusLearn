import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Students',
  description: 'Access the Students portal on CampusLearn, your centralized e-learning platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
