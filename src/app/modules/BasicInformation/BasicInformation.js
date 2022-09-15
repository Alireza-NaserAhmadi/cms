/** @format */

import React from "react"
import { Redirect, Switch } from "react-router-dom"
import CountriesTable from "./countries/countriesTable"
import ProvincesTable from "./provinces/provincesTable"
import TownshipsTable from "./townships/townshipsTable"
import BrandsTable from "./brands/brandsTable"
import ColorsTable from "./colors/colorsTable"

import { ContentRoute } from "../../../_metronic/layout"

export default function BasicInformation() {
  return (
    <Switch>
      <Redirect exact={true} from="/basicinfo" to="/basicinfo/countriesTable" />

      <ContentRoute
        path="/basicinfo/countriestable"
        component={CountriesTable}
      />
      <ContentRoute
        path="/basicinfo/provincestable"
        component={ProvincesTable}
      />
      <ContentRoute
        path="/basicinfo/townshipstable"
        component={TownshipsTable}
      />
      <ContentRoute path="/basicinfo/brandstable" component={BrandsTable} />
      <ContentRoute path="/basicinfo/colorstable" component={ColorsTable} />
      {/* <ContentRoute
        path="/react-bootstrap/badge"
        component={BadgeExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/breadcrumb"
        component={BreadcrumbExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/buttons"
        component={ButtonsExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/button-group"
        component={ButtonGroupExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/cards"
        component={CardsExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/carousel"
        component={CarouselExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/dropdowns"
        component={DropdownsExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/forms"
        component={FormsExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/input-group"
        component={InputGroupExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/images"
        component={ImagesExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/figures"
        component={FiguresExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/jumbotron"
        component={JumbotronExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/list-group"
        component={ListGroupExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/modal"
        component={ModalExamplesPage}
      />
      <ContentRoute path="/react-bootstrap/navs" component={NavsExamplesPage} />
      <ContentRoute
        path="/react-bootstrap/navbar"
        component={NavbarExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/overlays"
        component={OverlaysExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/pagination"
        component={PaginationExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/popovers"
        component={PopoversExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/progress"
        component={ProgressExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/spinners"
        component={SpinnersExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/table"
        component={TableExamplesPage}
      />
      <ContentRoute path="/react-bootstrap/tabs" component={TabsExamplesPage} />
      <ContentRoute
        path="/react-bootstrap/tooltips"
        component={TooltipsExamplesPage}
      />
      <ContentRoute
        path="/react-bootstrap/toasts"
        component={ToastsExamplesPage}
      /> */}
    </Switch>
  )
}
