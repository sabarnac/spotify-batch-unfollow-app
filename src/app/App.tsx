import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Description from "./partials/description/Description";
import Footer from "./partials/footer/Footer";
import Header from "./partials/header/Header";
import Loading from "./partials/loading/Loading";
import { Oauth2PkceCallback } from "../util/use-oauth-pkce";
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URL, SPOTIFY_TOKEN_URL } from "../constants";

const SpotifyApp = lazy(() => import("./spotify-app/SpotifyApp"));

const App = (): JSX.Element => (
  <>
    <Header />
    <Description />
    <BrowserRouter>
      <div>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/callback"
              element={
                <Oauth2PkceCallback
                  tokenUrl={SPOTIFY_TOKEN_URL}
                  redirectUri={SPOTIFY_REDIRECT_URL}
                  clientId={SPOTIFY_CLIENT_ID}
                />
              }
            />
            <Route path="/" element={<SpotifyApp />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
    <Footer />
  </>
);

export default App;
