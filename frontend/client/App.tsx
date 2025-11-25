import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import AppRoutes from "./AppRoutes";
import { store } from "./states/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutModal from "@/components/LayoutModal";
import PlayerBar from "@/components/layout/PlayerBar";

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <LayoutModal>
        <ToastContainer />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LayoutModal>
    </Provider>
  );
}

export default App;
