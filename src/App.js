import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import NavigationBar from './components/NavigationBar';
import Currency from './features/currency/Currency';
import Stocks from './features/stocks/Stocks';
import StockDetails from './features/stocks/StockDetails';
import Homepage from './components/Homepage';
import { Container } from 'react-bootstrap';

function App() {

  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Container>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/currency" element={<Currency />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/stocks/:symbol" element={<StockDetails />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
}

export default App;