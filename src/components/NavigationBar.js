import {Navbar, Container, Nav, Form} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {setUserCurrency} from '../features/currency/currencySlice';
import {useNavigate} from 'react-router-dom';
import { useState } from 'react';

function NavigationBar() {

  const { currencyList, userCurrency } = useSelector((state) => state.currency);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tempUserCurrency, setTempUserCurrency] = useState("");

  const handleCurrencyChange = (e) => {
    let chosenCurrency;
    if((e.target.value).length === 3) {
      chosenCurrency = e.target.value;
    } else {
      chosenCurrency = "";
    }
    dispatch(setUserCurrency({chosenCurrency, tempUserCurrency}));
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand style={{cursor: 'pointer'}} onClick={() => navigate('/')}>Stocks APP</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate('/stocks')}>Stocks</Nav.Link> 
              <Nav.Link onClick={() => navigate('/currency')}>Currency</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link>
                <Form.Select style={{maxWidth: '280px'}} aria-label="Currency List" onChange={(e) => {
                  setTempUserCurrency(userCurrency)
                  handleCurrencyChange(e)
                  }}>
                  <option>Select your preferred currency</option>
                  {
                    currencyList.map((currency, index) => (
                      <option key={index} value={currency.code}>{currency.code} - {currency.name}</option>
                    ))
                  }
                </Form.Select>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
    </Navbar>
  );
};


export default NavigationBar;