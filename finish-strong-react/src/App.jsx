import React from "react";
import { Container, Divider, Header } from "semantic-ui-react";
import "./App.css";
import RegisterForm from "./components/register/RegisterForm";

function App() {
  return (
    <div className="App">
      <Container style={{ marginTop: 40 }}>
        <Header>Finish Strong</Header>
        <Divider hidden></Divider>
        <RegisterForm />
      </Container>
    </div>
  );
}

export default App;
