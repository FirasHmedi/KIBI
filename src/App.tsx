import { Header } from "./components/Header";
import Home from "./pages/home/Home";
import { appStyle } from "./styles/Style";


const App = () => {
  return(
    <div style={appStyle}>
      <Header />
      <Home />
    </div>
  )
}

export default App;
