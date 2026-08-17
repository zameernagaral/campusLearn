import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Id',
  description: 'Access the Id portal on CampusLearn, your centralized e-learning platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
