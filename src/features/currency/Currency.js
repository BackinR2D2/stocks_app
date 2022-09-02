import { React, useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Card, Col, Form, Row, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Currency() {

  const [latestCurrencies, setLatestCurrencies] = useState([]);
  const { currencyList, userCurrency } = useSelector((state) => state.currency);
  const [currencyConvert, setCurrencyConvert] = useState("USD");
  const [userInput, setUserInput] = useState(1);
  const [value, setValue] = useState(0);

  const getLatestCurrencies = async (base) => {
    try {
      const { data } = await axios.get(`https://api.exchangerate.host/latest/?base=${base}`);
      setLatestCurrencies(data.rates);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Some error occured while trying to fetch the latest currencies. Try again later.',
        position: 'center'
      });
    }
  }

  useEffect(() => {
    getLatestCurrencies(userCurrency);
    handleCurrencyConvertChange();
  }, [userCurrency])

  useEffect(() => {
    handleCurrencyConvertChange();
  }, [currencyConvert])

  const handleCurrencyConvert = (e) => {
    setCurrencyConvert(e.target.value === 'Convert Into' ? 'USD' : e.target.value);
  }

  const handleCurrencyConvertChange = async () => {
    if(!isNaN(userInput) && userInput !== 0 && userCurrency !== currencyConvert) {
      const { data } = await axios.get(`https://api.exchangerate.host/convert?from=${userCurrency}&to=${currencyConvert}&amount=${userInput}`);
      setValue(data.result);
    }
  }

  const handleConversion = async (e) => {
    setUserInput(e.target.value ? e.target.value : 1);
    const userInput = parseInt(e.target.value !== '' ? e.target.value : 1);
    if(!isNaN(userInput) && userInput !== 0 && userCurrency !== currencyConvert) {
      const { data } = await axios.get(`https://api.exchangerate.host/convert?from=${userCurrency}&to=${currencyConvert}&amount=${userInput}`);
      setValue(data.result);
    } else {
      setValue(0);
    }
  }

  const goToTop = () => {
    window.scroll({top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <div className="currencyConverter">
        <Form>
          <Row>
            <Col>
              <Form.Control placeholder="Enter number" onChange={handleConversion} />
            </Col>
            <Col>
              <Form.Select aria-label="Currency List" onChange={handleCurrencyConvert} >
                  <option>Convert Into</option>
                  {
                    currencyList.map((currency, index) => (
                      <option key={index} value={currency.code}>{currency.code} - {currency.name}</option>
                    ))
                  }
              </Form.Select>
            </Col>
          </Row>
        </Form>
        <div className="convertedValue">
          {userInput === '' ? 1 : userInput} {userCurrency} {userCurrency === currencyConvert ? '' : `- ${value} ${currencyConvert}`}
        </div>
      </div>
      <hr />
      <div className="currencies">
        {
          Object.entries(latestCurrencies).map(([key, value], index) => (
            key !== userCurrency ?
              <Card style={{ width: '10rem', margin: '0 auto' }} key={index}>
                <Card.Body style={{textAlign: 'center'}}>
                  <Card.Title>{key}</Card.Title>
                  <hr />
                  <Card.Subtitle className="mb-2 text-muted">{value}</Card.Subtitle>
                </Card.Body>
              </Card>
            :
            <Fragment key={index}></Fragment>
          ))
        }
      </div>
      <div className="scrollToTop">
        <Button variant="primary" onClick={goToTop}>Go to top</Button>
      </div>
    </div>
  )
}

export default Currency