import React, { Suspense, lazy } from "react";
import Header from "./partials/header/Header";
import Footer from "./partials/footer/Footer";
import Description from "./partials/description/Description";
import { OAuthCallback } from "react-oauth2-hook";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Loading from "./partials/loading/Loading";

const SpotifyApp = lazy(() => import("./spotify-app/SpotifyApp"));

export default (): JSX.Element => (
  <>
    <Header />
    <Description />
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/callback" component={OAuthCallback} />
          <Route component={SpotifyApp} />
        </Switch>
      </Suspense>
    </BrowserRouter>
    <Footer />
  </>
);
