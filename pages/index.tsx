import AboutMeComponent from '../components/aboutMe';
import DesignProcessComponent from '../components/designProcess';
import Hero from '../components/hero';
import MainContainer from '../components/mainContainer';

export default function Home() {
  return (
     <MainContainer>
       <Hero/>
       <AboutMeComponent/>
       <DesignProcessComponent/>
     </MainContainer>
  );
}