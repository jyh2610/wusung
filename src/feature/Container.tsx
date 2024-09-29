import { assignInlineVars } from '@vanilla-extract/dynamic';
import { container, themeVars } from '@/app/style.css';
import { Input } from '@/shared/ui';
import { Button } from '@/shared/ui/Button';
interface ContainerProps {
  brandColor: string;
  fontFamily: string;
}

const Container = ({ brandColor, fontFamily }: ContainerProps) => (
  <section>
    <Button type={'default'} content={'textbutotn'} btnSize={'small'} />
    <Input label="text" />
  </section>
);

export default Container;
