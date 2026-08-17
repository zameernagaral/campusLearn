import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Access the Users portal on CampusLearn, your centralized e-learning platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
