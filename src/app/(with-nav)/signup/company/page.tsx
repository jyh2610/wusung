import { Company } from '@/entities';
import { inputContainer } from '../index.css';

function CompanyPage() {
  return (
    <div className={inputContainer}>
      <Company />
    </div>
  );
}

export default CompanyPage;
