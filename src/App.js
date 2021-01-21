import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Link,
  Breadcrumbs,
  Collapse,
  IconButton,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

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
  const [show, setShow] = useState(false); //for alert

  const [IDCS, setIDCS] = useState();
  const [phone, setPhone] = useState();
  const [otp, setOtp] = useState();
  const [isOTPSent, SetIsOTPSent] = useState(false);
  const [optSuccess, setOtpSucess] = useState(false);
  const [error, setError] = useState(null);

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

  const onSendOTP = (event) => {
    event.preventDefault();
    // var phoneNumber = getPhoneNumberFromUserInput();
    setUpRecaptcha();

    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phone, appVerifier)
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
        setOtpSucess(true);
        alert('OTP verification  successful');
      })
      .catch(function (error) {
        setShow(true);
        setError(error);
      });
  };
  return (
    <Container maxWidth="md">
      <Box
        style={{ border: '3px solid black', padding: '3em', marginTop: '5em' }}
      >
        {isOTPSent && show && !error ? (
          <Collapse in={show}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setShow(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              Code Sent successfully
            </Alert>
          </Collapse>
        ) : null}
        {error && show ? (
          <Collapse in={show}>
            <Alert
              variant="outlined"
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setShow(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {error.message}
            </Alert>
          </Collapse>
        ) : null}

        {/* Main input boxes */}
        <Grid container direction="column">
          {/* Item for link */}
          <Grid item>
            <Breadcrumbs aria-label="breadcrumb">
              <Link href="#" onClick={() => console.log('Click')}>
                Services aux individus
              </Link>
              <Typography color="textPrimary"> Generer le VID</Typography>
            </Breadcrumbs>
          </Grid>
          {/* For otp send */}
          <Grid
            item
            direction="column"
            style={{ marginTop: '2em', marginBottom: '1em' }}
          >
            <Grid item container justify="space-around">
              <Grid item xs={5}>
                <Typography variant="h5">Enter IDCS</Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  size="small"
                  id="outlined-basic"
                  label="IDCS"
                  variant="outlined"
                  value={IDCS}
                  onChange={(e) => setIDCS(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid
              item
              container
              justify="space-around"
              style={{ marginTop: '1em' }}
            >
              <Grid item xs={5}>
                <Typography variant="h5">Enter numero de telephone</Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  size="small"
                  id="outlined-basic"
                  label="Phone"
                  variant="outlined"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>
            </Grid>
            <div id="recaptcha-container"></div>
            <Grid item container justify="center" style={{ marginTop: '1em' }}>
              <Button variant="outlined" onClick={onSendOTP}>
                Envoyer OTP
              </Button>
            </Grid>
          </Grid>
          {/* For otp recieve */}
          {isOTPSent && (
            <Grid
              item
              direction="column"
              style={{ marginTop: '0.5em', marginBottom: '1em' }}
            >
              <Grid
                item
                container
                justify="space-around"
                style={{ marginTop: '1em' }}
              >
                <Grid item xs={5}>
                  <Typography variant="h5">Renseignez OTP</Typography>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    label="otp"
                    variant="outlined"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Grid>
              </Grid>
              <div id="recaptcha-container"></div>
              <Grid
                item
                container
                justify="center"
                style={{ marginTop: '1em' }}
              >
                <Button
                  variant="outlined"
                  onClick={onSubmitOtp}
                  style={{ marginRight: '1em' }}
                >
                  Generer VID
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => console.log('cancel')}
                  style={{ marginRight: '1em' }}
                >
                  Annuler
                </Button>
              </Grid>
            </Grid>
          )}
          {optSuccess && (
            <Grid
              item
              container
              direction="column"
              xs={6}
              component={Box}
              alignSelf="center"
              justify="space-between"
              style={{
                border: '3px solid black',
                padding: '1em',
                marginBottom: '1em',
              }}
            >
              <Typography variant="subtitle1">
                Identite virtuelle generee
              </Typography>
              <Typography variant="subtitle1">GH542157524</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
