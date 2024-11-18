import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store';
import AppRoutes from './routes';
import AlertManager from './components/Alert/AlertManager';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <AlertManager />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
