/** @format */

import React, { useEffect, useMemo, useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { connect, shallowEqual, useSelector } from "react-redux"
import { injectIntl } from "react-intl"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import { ToastContainer, toast } from "react-toastify"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import * as Yup from "yup"
import * as countries from "./_redux/countriesRedux"
import { Input, Select } from "../../../../_metronic/_partials/controls"
import { Formik, Form, Field } from "formik"
import SVG from "react-inlinesvg"
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls"
import { toAbsoluteUrl, sortCaret } from "../../../../_metronic/_helpers"
import Table from "../../../../function/Table"
import {
  deleteCountry,
  createCountry,
  updateCountry,
  getAllCountries,
} from "./_redux/countriesCrud"
import TextField from "@material-ui/core/TextField"

const CustomerEditSchema = Yup.object().shape({
  title: Yup.string("پر کردن فیلد الزامی است")
    .required("پر کردن فیلد الزامی است")
    .typeError("پر کردن فیلد الزامی است"),
})

function CountriesTable(props) {
  const { user } = useSelector((state) => state.auth)
  const { countries } = useSelector((state) => state.country.countries)

  const [open, setOpen] = React.useState(false)
  const [current, setCurrent] = React.useState({ title: "" })
  const [editOpen, setEditOpen] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)

  const toastId = React.useRef(null)

  useEffect(() => {
    getAllCountries(user).then((res) => props.getAllCountries(res.data.data))
  }, [])

  const handleEditClose = () => {
    setCurrent({ title: "" })
    setEditOpen(false)
    setEditMode(false)
  }

  const handleClose = () => {
    setEditOpen(false)
  }

  const handleOpen = () => {
    setEditOpen(true)
  }

  const handleDelete = (current) => {
    setOpen(false)
    deleteCountry(user, current.id)
    toast.success("کشور با موفقیت حذف شد")
    getAllCountries(user).then((res) => props.getAllCountries(res.data.data))
  }

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
      text: "کشور",
      sort: true,
      // filter: textFilter()
      sortCaret: sortCaret,
    },

    {
      dataField: "action",
      text: "عملیات",
      sort: false,
      sortCaret: sortCaret,

      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-edit-tooltip">ویرایش کشور</Tooltip>
              }
            >
              <a
                style={{ width: 25, height: 25 }}
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                onClick={() => {
                  setCurrent(row)
                  setEditOpen(true)
                  setEditMode(true)
                }}
              >
                <span className="svg-icon svg-icon-md svg-icon-primary">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/svg/icons/Communication/Write.svg"
                    )}
                  />
                </span>
              </a>
            </OverlayTrigger>
            <OverlayTrigger
              overlay={<Tooltip id="products-delete-tooltip">حذف کشور</Tooltip>}
            >
              <a
                style={{ width: 25, height: 25 }}
                className="btn btn-icon btn-light btn-hover-danger btn-sm"
                onClick={() => {
                  setCurrent(row)
                  setOpen(true)
                }}
              >
                <span className="svg-icon svg-icon-md svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                  />
                </span>
              </a>
            </OverlayTrigger>
          </>
        )
      },
      sort: true,
    },
  ]

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        rtl={true}
        pauseOnHover
      />
      <div className="container">
        <Card>
          <CardHeader title="لیست کشورها ">
            <CardHeaderToolbar>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleOpen()
                }}
              >
                کشور جدید
              </button>
            </CardHeaderToolbar>
          </CardHeader>
          <CardBody>
            {countries != undefined
              ? Table({
                  data: countries,
                  columns: columns,
                })
              : null}
          </CardBody>
        </Card>

        <Dialog
          open={open}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"آیا واقعا قصد حذف این کشور را دارید ؟"}
          </DialogTitle>
          <DialogContent style={{ borderBottom: "1px solid red" }}>
            <DialogContentText id="alert-dialog-slide-description"></DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose()
              }}
            >
              انصراف
            </Button>
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => handleDelete(current)}
              className="btn btn-danger"
              color="danger"
            >
              حذف
            </Button>
          </DialogActions>
        </Dialog>

        <Formik
          enableReinitialize
          validateOnBlur={true}
          initialValues={{ title: "" }}
          validationSchema={CustomerEditSchema}
          onSubmit={(values) => {
            if (!editMode) {
              createCountry(user, values)
                .then((res) => {
                  getAllCountries(user).then((res) =>
                    props.getAllCountries(res.data.data)
                  )

                  toast.success("کشور جدبد با موفقیت اضافه شد")
                  values.title = ""
                })
                .catch(() => {
                  toast.error("خطایی رخ داده است")
                })
              setCurrent({ title: "" })
              setEditOpen(false)
            } else if (editMode) {
              const updateData = {
                title: values.title,
              }
              updateCountry(user, current.id, updateData)
                .then((res) => {
                  getAllCountries(user).then((res) =>
                    props.getAllCountries(res.data.data)
                  )

                  toast.success("کشور با موفقیت ویرایش شد")
                  values.title = ""
                })
                .catch(() => {
                  toast.error("خطایی رخ داده است")
                })
              setCurrent({ title: "" })
              setEditOpen(false)
              setEditMode(false)
            }
          }}
        >
          {({
            handleSubmit,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
            initialValues,
            values,
          }) => (
            <>
              <Modal show={editOpen} onHide={handleEditClose}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {editMode ? "ویرایش کشور" : "افزودن کشور"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {!current ? null : (
                    <Form className="form form-label-right">
                      <div className="form-group row">
                        <div className="col-lg-6">
                          <label htmlFor="">نام کشور</label>
                          <TextField
                            onChange={(e) =>
                              setFieldValue("title", e.target.value)
                            }
                            id="outlined-basic"
                            name="title"
                            variant="outlined"
                            defaultValue={current.title}
                          />
                          {touched.title && errors.title ? (
                            <b className="text-danger mt-1">{errors.title}</b>
                          ) : null}
                        </div>
                      </div>
                    </Form>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleEditClose()
                    }}
                  >
                    انصراف
                  </Button>

                  <Button
                    className="btn btn-primary"
                    variant="primary"
                    onClick={() => handleSubmit()}
                  >
                    ثبت
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </Formik>
      </div>
    </>
  )
}
export default injectIntl(connect(null, countries.actions)(CountriesTable))
