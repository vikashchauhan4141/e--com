import SaleStrip from '../components/common/SaleStrip';
import HeroBanner from '../components/home/HeroBanner';
import CategorySection from '../components/home/CategorySection';
import ProductGrid from '../components/home/ProductGrid';
import FeaturedSection from '../components/home/FeaturedSection';

const Home = () => {
  return (
    <div className="page-wrapper">
      <div className="page-content">
        <SaleStrip />
        <HeroBanner />
        <CategorySection />
        <ProductGrid />
        <FeaturedSection />
      </div>
    </div>
  );
};

export default Home;
