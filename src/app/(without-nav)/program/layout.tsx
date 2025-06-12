import { colors } from '@/design-tokens';
import TemporaryDrawer from '@/entities/program/menu/DrawerMenu';
import { ProgramNav } from '@/entities/program/programNav';
import { getRole } from '@/shared/api/common';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const drawerWidth = 300; // 사이드바 너비

async function ProgramNavlayout({ children }: { children: React.ReactNode }) {
  const cookie = cookies().get('token')?.value ?? null;

  const hasPermission = await getRole(cookie);
  // if (hasPermission?.data === 'UNKNOWN') {
  //   redirect('/');
  // }
  console.log(hasPermission);
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
