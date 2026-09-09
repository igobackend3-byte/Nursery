import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { CatalogueProvider } from './context/CatalogueContext';
import { LanguageProvider } from './context/LanguageContext';
import ToastHost from './components/ToastHost';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import SearchResults from './pages/SearchResults';
import PlantFinder from './pages/PlantFinder';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import AdminApp from './admin/AdminApp';
import CustomerProtectedRoute from './components/CustomerProtectedRoute';
import Offers from './pages/Offers';
import JustInPage from './pages/JustInPage';
import GardenServices from './pages/GardenServices';
import Landscaping from './pages/Landscaping';
import Blog from './pages/Blog';
import LocateStore from './pages/LocateStore';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import ShippingPolicy from './pages/ShippingPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import './App.css';
import './styles/site.css';
import './styles/animations.css';
import './styles/nature-decor.css';
import './styles/bundle-butterfly.css';

function App() {
  return (
    <LanguageProvider>
    <AuthProvider>
      <CatalogueProvider>
        <StoreProvider>
          <BrowserRouter>
            <ToastHost />
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="admin/*" element={<AdminApp />} />
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="category/:slug" element={<CategoryPage />} />
                <Route path="search" element={<SearchResults />} />
                <Route path="plant-finder" element={<PlantFinder />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="gifting" element={<CategoryPage slugOverride="gifting" />} />
                <Route path="corporate-gifts" element={<CategoryPage slugOverride="corporate-gifts" />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<CustomerProtectedRoute><Checkout /></CustomerProtectedRoute>} />
                <Route path="account" element={<CustomerProtectedRoute><Account /></CustomerProtectedRoute>} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="offers" element={<Offers />} />
                <Route path="just-in" element={<JustInPage />} />
                <Route path="garden-services" element={<GardenServices />} />
                <Route path="landscaping" element={<Landscaping />} />
                <Route path="blog" element={<Blog />} />
                <Route path="locate-store" element={<LocateStore />} />
                <Route path="about" element={<About />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<Contact />} />
                <Route path="shipping-policy" element={<ShippingPolicy />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </StoreProvider>
      </CatalogueProvider>
    </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
