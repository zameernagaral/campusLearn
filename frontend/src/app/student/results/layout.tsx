import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Results',
  description: 'Access the Results portal on CampusLearn, your centralized e-learning platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
