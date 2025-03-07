import { Hero } from '@/components/Hero';

const Homepage = async () => {
  return (
    <div className="z-[1000] fixed top-0 left-0 h-screen bg-slate-100 w-screen overflow-hidden">
      <Hero />
    </div>
  );
};

// Indicate this page uses the custom homepage layout without navigation
Homepage.getLayout = 'homepage';

export default Homepage;
