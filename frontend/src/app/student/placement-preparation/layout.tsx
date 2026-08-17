import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Placement Preparation',
  description: 'Access the Placement Preparation portal on CampusLearn, your centralized e-learning platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
