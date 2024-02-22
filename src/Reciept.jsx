// Import React
import React from 'react';

// Styles
const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f8f8',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    margin: '100px auto',
    maxWidth: '800px',
  },
  h1: {
    color: '#d9534f',
    fontSize: '36px',
  },
  p: {
    fontSize: '18px',
    marginTop: '20px',
  },
  a: {
    color: '#337ab7',
    textDecoration: 'none',
  },
};

// React Component
const ErrorPage = () => {
  return (
    <body style={styles.body}>
      <div style={styles.errorContainer}>
        <h1 style={styles.h1}>Error: Malpractice Observed</h1>
        <p style={styles.p}>The voter has not been registered. Your actions have been reported</p><br/><br/>
      </div>
    </body>
  );
};

// Export the component
export default ErrorPage;
