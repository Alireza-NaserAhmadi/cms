/** @format */

import React, { useEffect, useMemo, useState } from "react"

import { connect, shallowEqual, useSelector } from "react-redux"
import { injectIntl } from "react-intl"
import * as countries from "./_redux/countriesRedux"
import BootstrapTable from "react-bootstrap-table-next"
import ToolkitProvider from "react-bootstrap-table2-toolkit"
import axios from "axios"
import config from "../../../../config/config"
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls"
import { toAbsoluteUrl, sortCaret } from "../../../../_metronic/_helpers"
import Table from "../../../../function/Table"

const GET_ALL_COUNTRY = config.baseUrl + "country/getAll"

function CountriesTable() {
  const { user } = useSelector((state) => state.auth)

  const [country, setCountry] = useState(null)

  useEffect(() => {
    axios
      .get(GET_ALL_COUNTRY, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setCountry(res.data.data))
  }, [])
  const columns = [
    {
      dataField: "id",
      text: "شناسه",
      sort: true,
      sortCaret: sortCaret,
      // filter: textFilter()
    },
    {
      dataField: "title",
      text: "شهر",
      sort: true,
      // filter: textFilter()
      sortCaret: sortCaret,
    },
    // {
    //   dataField: "answer",
    //   text: "پاسخ",
    //   sort: true,
    //   // filter: textFilter()
    //   sortCaret: sortCaret,
    // },
    // {
    //   dataField: "status",
    //   text: "وضعیت",
    //   sort: true,
    //   formatter: columnFormatters.StatusFormatter,
    //   // filter: textFilter()
    //   sortCaret: sortCaret,
    // },
    // {
    //   dataField: "action",
    //   text: "عملیات",
    //   sort: false,
    //   sortCaret: sortCaret,

    //   formatter: (cell, row, rowIndex, formatExtraData) => {
    //     return (
    //       <>
    //         <OverlayTrigger
    //           overlay={
    //             <Tooltip id="products-edit-tooltip">ویرایش سوال</Tooltip>
    //           }
    //         >
    //           <a
    //             style={{ width: 25, height: 25 }}
    //             className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
    //             onClick={() => {
    //               setCurrent(row)
    //               setEditOpen(true)
    //               setEditMode(true)
    //             }}
    //           >
    //             <span className="svg-icon svg-icon-md svg-icon-primary">
    //               <SVG
    //                 src={toAbsoluteUrl(
    //                   "/media/svg/icons/Communication/Write.svg"
    //                 )}
    //               />
    //             </span>
    //           </a>
    //         </OverlayTrigger>
    //         <OverlayTrigger
    //           overlay={<Tooltip id="products-delete-tooltip">حذف سوال</Tooltip>}
    //         >
    //           <a
    //             style={{ width: 25, height: 25 }}
    //             className="btn btn-icon btn-light btn-hover-danger btn-sm"
    //             onClick={() => {
    //               setCurrent(row)
    //               setOpen(true)
    //             }}
    //           >
    //             <span className="svg-icon svg-icon-md svg-icon-danger">
    //               <SVG
    //                 src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
    //               />
    //             </span>
    //           </a>
    //         </OverlayTrigger>
    //       </>
    //     )
    //   },
    //   sort: true,
    // },
  ]
  console.log("country", country)
  return (
    <>
      <div className="container">
        <Card>
          <CardHeader title="لیست سوال ">
            <CardHeaderToolbar>
              <button
                type="button"
                className="btn btn-primary"
                // onClick={() => {
                //   handleClickOpen()
                // }}
              >
                سوال جدید
              </button>
            </CardHeaderToolbar>
          </CardHeader>
          <CardBody>
            {Table({
              data: country,
              columns: columns,
            })}
          </CardBody>
        </Card>
      </div>
    </>
  )
}
export default injectIntl(connect(null, countries.actions)(CountriesTable))
