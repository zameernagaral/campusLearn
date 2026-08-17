import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
