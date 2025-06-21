import '../globals.css';
import { colors } from '@/design-tokens';
import { Footer } from '@/entities';
import { Nav } from '@/entities/Nav';
import { layout } from './style.css';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: colors.bg,
        position: 'relative',
        minHeight: 'calc(100vh - 140.4px)'
      }}
    >
      <Nav />
      <main className={layout}>{children}</main>
      <Footer />
    </div>
  );
}
