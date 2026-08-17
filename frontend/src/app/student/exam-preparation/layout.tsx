import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exam Preparation',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
