import { MainSectionStyles } from './index.css';
import { Story, Features, Notice } from './ui';
import { FamilySite } from './ui/FamilySite';

export function MainSection() {
  return (
    <section className={MainSectionStyles}>
      <Story />
      <Features />
      <Notice />
      <FamilySite />
    </section>
  );
}
