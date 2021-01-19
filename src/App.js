import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

//import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import data from './data.json';
import firebase from './firebase';

// const mappedData = data.map((row) => {
//   return {
//     value: row.number,
//     label: (
//       <div>
//         {' '}
//         {row.name} <img src={row.flag} height="30px" width="30px" />
//       </div>
//     ),
//   };
// });
function App() {
  const [otp, setOtp] = useState();
  const [country, setCountry] = useState(data[0].number);
  const [show, setShow] = useState(false);

  const [phone, setPhone] = useState();
  const [isOTPSent, SetIsOTPSent] = useState(false);

  const [error, setError] = useState(null);

  const onChangeHandler = (event) => {
    const { value } = event.target;
    setOtp(value);
  };
  const onChangePhone = (e) => {
    const { value } = e.target;

    setPhone(value);
  };
  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'visible',
        callback: function (response) {
          console.log('Captcha Resolved');
          this.onSignInSubmit();
        },
        defaultCountry: 'IN',
      }
    );
  };

  const onSignInSubmit = (event) => {
    event.preventDefault();
    // var phoneNumber = getPhoneNumberFromUserInput();
    setUpRecaptcha();
    var phoneNumber = country + phone;
    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        console.log('OTP is sent');
        setShow(true);
        SetIsOTPSent(true);
        setError(null);
      })
      .catch(function (error) {
        setShow(true);
        setError(error);
      });
  };
  const onSubmitOtp = (e) => {
    e.preventDefault();
    let otpInput = otp;
    let optConfirm = window.confirmationResult;
    // console.log(codee);
    optConfirm
      .confirm(otpInput)
      .then(function (result) {
        // User signed in successfully.
        console.log('Result' + result.verificationID);
        //let user = result.user;
        alert('Registration successful');
      })
      .catch(function (error) {
        setShow(true);
        setError(error);
      });
  };
  return (
    <div className="App">
      <Container fluid="md" className="mt-3 bg-info p-5 shadow rounded">
        {isOTPSent && show && !error ? (
          <Alert variant="success" onClose={() => setShow(false)} dismissible>
            Code Sent successfully
          </Alert>
        ) : null}
        {error && show ? (
          <Alert variant="danger" onClose={() => setShow(false)} dismissible>
            {error.message}
          </Alert>
        ) : null}
        {!isOTPSent ? (
          <Row className="d-flex justify-content-center align-items-center">
            <Col xs={12} md={6} lg={5}>
              <h2 className="mb-3 text-center">Login</h2>

              <Form className="form" onSubmit={onSignInSubmit}>
                <Form.Label className="text-center">
                  {' '}
                  We need to verify you are a human
                </Form.Label>

                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control
                    as="select"
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {data.map((row) => (
                      <option key={row.name} value={row.number}>
                        {row.name}
                      </option>
                    ))}
                  </Form.Control>
                  {/* <Select
                    defaultInputValue={country}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    options={mappedData}
                  /> */}
                </Form.Group>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon3">
                      {country}
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    id="basic-url"
                    aria-describedby="basic-addon3"
                    type="number"
                    name="phone"
                    placeholder="Mobile Number"
                    onChange={onChangePhone}
                    required
                  />
                </InputGroup>
                <div id="recaptcha-container"></div>
                <button className="btn btn-success btn-block" type="submit">
                  Submit
                </button>
              </Form>
            </Col>
          </Row>
        ) : null}

        {isOTPSent ? (
          <Row className="d-flex justify-content-center align-items-center">
            <Col xs={12} md={6} lg={5}>
              <h2 className="mb-3 text-center">Enter OTP</h2>
              <Form className="form" onSubmit={onSubmitOtp}>
                <Form.Group>
                  <Form.Control
                    id="otp"
                    type="number"
                    name="otp"
                    placeholder="OTP"
                    onChange={onChangeHandler}
                  />
                </Form.Group>
                <div id="recaptcha-container"></div>
                <button className="btn btn-success btn-block" type="submit">
                  Submit
                </button>

                <a
                  href="#"
                  className="text-white text-center"
                  onClick={onSignInSubmit}
                >
                  Resend Code
                </a>
                <a
                  href="#"
                  className="text-white text-center mx-4"
                  onClick={() => {
                    setOtp('');
                    setShow(false);
                    SetIsOTPSent(false);
                  }}
                >
                  Back
                </a>
              </Form>
            </Col>
          </Row>
        ) : null}
      </Container>
    </div>
  );
}

export default App;
