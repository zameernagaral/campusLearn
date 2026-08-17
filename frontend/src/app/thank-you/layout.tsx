import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank You',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
