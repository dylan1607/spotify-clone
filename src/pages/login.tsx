import { getProviders, signIn } from 'next-auth/react';

const login = ({ providers }: any) => {
  return (
    <div
      className='flex flex-col items-center bg-black min-h-screen
      w-full justify-center text-white space-y-5'
    >
      <h1 className='text-bold'>Welcome to my home</h1>
      <img
        src='https://i.imgur.com/CMRgXC6.gif'
        alt=''
        className='w-92 rounded-lg'
      />
      {Object.values(providers).map((provider: any) => (
        <div key={provider.name}>
          <button
            className='bg-[#18D860] text-white p-5 rounded-lg'
            onClick={() => signIn(provider.id, { callbackUrl: '/' })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
