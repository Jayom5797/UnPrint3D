import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShoppingPage from "./pages/ShoppingPage";
import SocialLinks from './components/SocialLinks';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShoppingPage />} />
      </Routes>
      <SocialLinks />
    </Router>
  );
};

export default App;
