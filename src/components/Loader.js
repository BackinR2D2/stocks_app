import { React } from 'react';
import { Spinner } from 'react-bootstrap';

function Loader() {
  return (
    <div className="loader">
        <Spinner animation="border" variant="secondary" style={{width: '10vw', height: '10vw'}} />
    </div>
  )
}

export default Loader;