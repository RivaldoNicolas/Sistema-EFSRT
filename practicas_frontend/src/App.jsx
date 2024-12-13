import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store';
import AppRoutes from './routes';
import AlertManager from './components/Alert/AlertManager';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <div className="App">
          <AlertManager />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </Provider>
  );
}
export default App;
