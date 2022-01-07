import { getSession } from 'next-auth/react';
import Center from '~/components/Center';
import Player from '~/components/Player';
import Sidebar from '~/components/Sidebar';

export default function Home() {
  return (
    <div className='bg-black h-screen overflow-hidden'>
      <main className='flex'>
        {/* Sidebar */}
        <Sidebar />
        {/* Center */}
        <Center />
      </main>

      <footer className='sticky bottom-0'>
        <Player />
      </footer>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
