import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShoppingPage from "./pages/ShoppingPage";
import ProductPage from "./pages/ProductPage";
import SocialLinks from './components/SocialLinks';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShoppingPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <SocialLinks />
    </Router>
  );
};

export default App;
