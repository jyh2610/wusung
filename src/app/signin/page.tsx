import { LoginModal } from '@/entities';
import { pageContainer } from '../signup/index.css';

function Signin() {
  return (
    <div className={pageContainer}>
      <LoginModal />
    </div>
  );
}

export default Signin;
