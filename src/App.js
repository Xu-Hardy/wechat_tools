import React from 'react';
import MarkdownToRichText from './components/MarkdownToRichText';
import { Container, CssBaseline } from '@mui/material';

function App() {
  return (
      <Container component="main">
        <CssBaseline />
        <MarkdownToRichText />
      </Container>
  );
}

export default App;
