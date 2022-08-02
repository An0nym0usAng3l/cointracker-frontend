import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./Components/Header"
import Dashboard from "./Pages/Dashboard"
import { makeStyles } from "@material-ui/core"
import Alert from './Components/Alert'

function App() {

  const useStyles = makeStyles(() => ({
    App: {
      backgroundColor: "var(--bg-main)",
      color: "var(--white)",
      minHeight: "100vh",
      fontFamily: "poppins",
    },
  }))
  const classes = useStyles();
  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} exact />
        </Routes>
      </div>
      <Alert />
    </BrowserRouter>
  );
}

export default App;
