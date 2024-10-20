import { MainSectionStyles } from './index.css';
import { Story, Features, Notice } from './ui';

export function MainSection() {
  return (
    <section className={MainSectionStyles}>
      <Story />
      <Features />
      <Notice />
    </section>
  );
}
