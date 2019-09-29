import React, { Fragment } from "react"
import Header from "./partials/header/Header"
import Footer from "./partials/footer/Footer"
import Description from "./partials/description/Description"
import SpotifyApp from "./spotify-app/SpotifyApp"

export default (): JSX.Element => (
  <Fragment>
    <Header />
    <Description />
    <SpotifyApp />
    <Footer />
  </Fragment>
)
