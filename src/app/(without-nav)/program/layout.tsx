import { colors } from '@/design-tokens';
import TemporaryDrawer from '@/entities/program/menu/DrawerMenu';
import { ProgramNav } from '@/entities/program/programNav';

const drawerWidth = 300; // 사이드바 너비

function ProgramNavlayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: colors.bg
      }}
    >
      <ProgramNav />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <div style={{ width: `${drawerWidth}px`, flexShrink: 0 }}>
          <TemporaryDrawer />
        </div>
        <main style={{ flexGrow: 1, padding: '20px' }}>{children}</main>
      </div>
    </div>
  );
}

export default ProgramNavlayout;
