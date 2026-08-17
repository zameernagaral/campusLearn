import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Placement Analytics',
  description: 'Access the Placement Analytics portal on CampusLearn, your centralized e-learning platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
