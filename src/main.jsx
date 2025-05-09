import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import "../public/css/tailwind.css";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store ,  { persistor } from './store';

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
    <ThemeProvider
       onThemeChange={(theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }}
    >
        <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
            </PersistGate>
        </Provider>
      </ThemeProvider>
    </BrowserRouter>
);
