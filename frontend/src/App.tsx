import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { setUser } from './store/userActions';
import Start from './components/start/start'
import BrokersPage from "./components/brokers/brokersList";
import StocksList from "./components/stocks/stocksList";
import TradeSettings from "./components/settings/tradeSettings";
import TradePage from "./components/trade/tradePage";


function App() {
  let currentUser;
  const initializeApp = () => {
    // @ts-ignore
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      store.dispatch(setUser(currentUser)); // setUser - действие для установки текущего пользователя
    }
  };

  // Вызов функции инициализации приложения при загрузке
  initializeApp();

  return (
      <div>
      <Provider store={store}>
        <BrowserRouter>
          <div className="App" style={{display: "flex", flexDirection: "column", justifyContent: "center", width: "100%"}}>
            <Routes>
              <Route path="/" Component={Start}/>
              <Route path="/brokers" element={<BrokersPage />} />
              <Route path="/stocks" element={<StocksList />} />
              <Route path="/settings" element={<TradeSettings />} />
              <Route path="/trade" element={<TradePage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </Provider>
      </div>
  );
}

export default App;