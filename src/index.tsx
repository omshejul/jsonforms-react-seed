import ReactDOM from 'react-dom';
import App from './App';
import { CustomThemeProvider } from './contexts/themeContext';
// require('dotenv').config()
const Main = () => {
  console.log("ENV", process.env.REACT_APP_ENV)

  return (
    <CustomThemeProvider>
      
      <App />
    </CustomThemeProvider>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));
 