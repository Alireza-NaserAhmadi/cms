/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 *
 * @format
 */

import React from "react"
import { Redirect, Switch, Route } from "react-router-dom"
import { shallowEqual, useSelector, useDispatch } from "react-redux"
import { Layout } from "../_metronic/layout"
import BasePage from "./BasePage"
import { Logout, AuthPage } from "./modules/Auth"
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage"
import * as auth from "../app/modules/Auth/_redux/authRedux"

export function Routes() {
  const [isTrue, setIsTrue] = React.useState(false)

  const dispatch = useDispatch()

  React.useLayoutEffect(() => {
    const expireTime = JSON.parse(localStorage.getItem("tokenExpireTime"))
    console.log("expireTime", expireTime)
    const user = JSON.parse(localStorage.getItem("user"))
    console.log("user", user)
    if (new Date(expireTime?.date) > new Date()) {
      dispatch(auth.actions.login(user))
      console.log("hoyaaaaaaaa", user)
    } else {
      localStorage.clear("user")
    }
    setIsTrue(true)
  }, [])

  const { isAuthorized } = useSelector(
    ({ auth }) => ({
      isAuthorized: localStorage.getItem("user"),
    }),
    shallowEqual
  )

  console.log("isAuthorized", isAuthorized)

  return (
    <>
      {isTrue && (
        <>
          <Switch>
            {!isAuthorized ? (
              /*Render auth page when user at `/auth` and not authorized.*/
              <Route>
                <AuthPage />
              </Route>
            ) : (
              /*Otherwise redirect to root page (`/`)*/
              <Redirect from="/auth" to="/" />
            )}

            <Route path="/error" component={ErrorsPage} />
            <Route path="/logout" component={Logout} />

            {!isAuthorized ? (
              /*Redirect to `/auth` when user is not authorized*/
              <Redirect to="/auth/login" />
            ) : (
              <Layout>
                <BasePage />
              </Layout>
            )}
          </Switch>
        </>
      )}
    </>
  )
}
