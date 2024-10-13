import { MainSectionStyles } from './index.css';
import { Story, Features } from './ui';

export function MainSection() {
  return (
    <section className={MainSectionStyles}>
      <Story />
      <Features />
    </section>
  );
}
