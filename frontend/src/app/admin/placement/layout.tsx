import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Placement',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
