import ReactDOM from 'react-dom';
import App from './App';
import { CustomThemeProvider } from './contexts/themeContext';

const Main = () => {
  return (
    <CustomThemeProvider>
      <App />
    </CustomThemeProvider>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));
