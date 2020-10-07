import React, { useEffect } from "react";
import { Container, Divider, Grid, Header, List } from "semantic-ui-react";
import "./App.css";
import Login from "./Register";

function App() {
  return (
    <div className="App">
      <Container style={{ marginTop: 40 }}>
        <Header>Finish Strong</Header>
        <Divider hidden></Divider>
        <Login></Login>
      </Container>
    </div>
  );
}

export default App;
