/** @format */

import React, { useEffect, Suspense, lazy } from "react"
import { Redirect, Switch, Route, useHistory } from "react-router-dom"
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout"
import { BuilderPage } from "./pages/BuilderPage"
import { MyPage } from "./pages/MyPage"
import { DashboardPage } from "./pages/DashboardPage"
import { shallowEqual, useSelector } from "react-redux"

const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
)
// const ReactBootstrapPage = lazy(() =>
//   import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
// );
const BasicInformationPage = lazy(() =>
  import("./modules/BasicInformation/BasicInformation")
)
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
)
const UserProfilepage = lazy(() =>
  import("./modules/UserProfile/UserProfilePage")
)

export default function BasePage() {
  const history = useHistory()

  const { isAuthorized } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user != null,
    }),
    shallowEqual
  )

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]))
    } catch (e) {
      return null
    }
  }

  // useEffect(() => {
  //   console.log("Base page")

  //   let token = localStorage.getItem("token")
  //   console.log("token", token)
  //   if (token) {
  //     const decodedJwt = parseJwt(token)

  //     if (decodedJwt.exp * 1000 < Date.now()) {
  //       history.push("/logout")
  //     }
  //   }
  // }, []) // [] - is required if you need only one call
  // //reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/builder" component={BuilderPage} />
        <ContentRoute path="/my-page" component={MyPage} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/basicinfo" component={BasicInformationPage} />
        <Route path="/e-commerce" component={ECommercePage} />
        <Route path="/user-profile" component={UserProfilepage} />
        {/* <Redirect to="error/error-v1" /> */}
      </Switch>
    </Suspense>
  )
}
