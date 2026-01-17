import { Logo } from '@/components/ui';

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed bottom-0 z-50 w-screen flex-col p-3 md:relative md:flex xl:min-h-full md:w-[74px]">
      <div className="hidden md:block">
        <Logo />
      </div>
    </aside>
  );
};
