import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ai Assistant',
  description: 'Access the Ai Assistant portal on CampusLearn, your centralized e-learning platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
