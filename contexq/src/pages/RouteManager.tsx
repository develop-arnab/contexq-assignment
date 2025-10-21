/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./Landing";
import { NavBar } from "../components";
import LoginPage from "./Login";
import CartPage from "./Cart";

interface RouteManagerProps {}

export const RouteManager: React.FC<RouteManagerProps> = ({}) => {
  // const {
  //   auth: { userType, provider, serviceType },
  //   loadingState,
  // } = StateData();

  return (
    <BrowserRouter>
      {/* <ShowLoader loaderModel={loadingState} /> */}
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};
