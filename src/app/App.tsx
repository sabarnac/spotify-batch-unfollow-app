import { lazy, Suspense } from "react";
import { OAuthPopup } from "@tasoskakour/react-use-oauth2";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Description from "./partials/description/Description";
import Footer from "./partials/footer/Footer";
import Header from "./partials/header/Header";
import Loading from "./partials/loading/Loading";

const SpotifyApp = lazy(() => import("./spotify-app/SpotifyApp"));

const App = (): JSX.Element => (
  <>
    <Header />
    <Description />
    <BrowserRouter>
      <div>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/callback" element={<OAuthPopup />} />
            <Route path="*" element={<SpotifyApp />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
    <Footer />
  </>
);

export default App;
