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
import * as brands from "./_redux/brandsRedux"
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
  deleteBrand,
  createBrand,
  updateBrand,
  getAllBrands,
} from "./_redux/brandsCrud"
import TextField from "@material-ui/core/TextField"

const CustomerEditSchema = Yup.object().shape({
  persianTitle: Yup.string("پر کردن فیلد الزامی است")
    .required("پر کردن فیلد الزامی است")
    .typeError("پر کردن فیلد الزامی است"),
  englishTitle: Yup.string("پر کردن فیلد الزامی است")
    .required("پر کردن فیلد الزامی است")
    .typeError("پر کردن فیلد الزامی است"),
})

function BrandsTable(props) {
  const { user } = useSelector((state) => state.auth)
  const { brands } = useSelector((state) => state.brands.brands)

  const [open, setOpen] = React.useState(false)
  const [current, setCurrent] = React.useState({
    persianTitle: "",
    englishTitle: "",
  })
  const [editOpen, setEditOpen] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)

  const toastId = React.useRef(null)

  useEffect(() => {
    getAllBrands(user).then((res) => props.getAllBrands(res.data.data))
  }, [])

  const handleEditClose = () => {
    setCurrent({ persianTitle: "", englishTitle: "" })
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
    deleteBrand(user, current.id)
    toast.success("برند با موفقیت حذف شد")
    getAllBrands(user).then((res) => props.getAllBrands(res.data.data))
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
      dataField: "persianTitle",
      text: "برند فارسی",
      sort: true,
      // filter: textFilter()
      sortCaret: sortCaret,
    },
    {
      dataField: "englishTitle",
      text: "برند انگلیسی",
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
                <Tooltip id="products-edit-tooltip">ویرایش برند</Tooltip>
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
              overlay={<Tooltip id="products-delete-tooltip">حذف برند</Tooltip>}
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
          <CardHeader title="لیست برند ها  ">
            <CardHeaderToolbar>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleOpen()
                }}
              >
                برند جدید
              </button>
            </CardHeaderToolbar>
          </CardHeader>
          <CardBody>
            {brands != undefined
              ? Table({
                  data: brands,
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
            {"آیا واقعا قصد حذف این برند را دارید ؟"}
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
          initialValues={{ persianTitle: "", englishTitle: "" }}
          validationSchema={CustomerEditSchema}
          onSubmit={(values) => {
            if (!editMode) {
              createBrand(user, values)
                .then((res) => {
                  getAllBrands(user).then((res) =>
                    props.getAllBrands(res.data.data)
                  )

                  toast.success("برند جدبد با موفقیت اضافه شد")
                  values.persianTitle = ""
                  values.englishTitle = ""
                })
                .catch(() => {
                  toast.error("خطایی رخ داده است")
                })
              setCurrent({ persianTitle: "", englishTitle: "" })
              setEditOpen(false)
            } else if (editMode) {
              const updateData = {
                persianTitle: values.persianTitle,
                englishTitle: values.englishTitle,
              }
              updateBrand(user, current.id, updateData)
                .then((res) => {
                  getAllBrands(user).then((res) =>
                    props.getAllBrands(res.data.data)
                  )

                  toast.success("برند با موفقیت ویرایش شد")
                  values.persianTitle = ""
                  values.englishTitle = ""
                })
                .catch(() => {
                  toast.error("خطایی رخ داده است")
                })
              setCurrent({ persianTitle: "", englishTitle: "" })
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
                    {editMode ? "ویرایش برند" : "افزودن برند"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {!current ? null : (
                    <Form className="form form-label-right">
                      <div className="form-group row">
                        <div className="col-lg-6">
                          <label htmlFor="">نام برند فارسی</label>
                          <TextField
                            onChange={(e) =>
                              setFieldValue("persianTitle", e.target.value)
                            }
                            id="outlined-basic"
                            name="persianTitle"
                            variant="outlined"
                            defaultValue={current.persianTitle}
                          />

                          {touched.persianTitle && errors.persianTitle ? (
                            <b className="text-danger mt-1">
                              {errors.persianTitle}
                            </b>
                          ) : null}
                        </div>
                        <div className="col-lg-6">
                          <label htmlFor="">نام برند انگلیسی</label>
                          <TextField
                            onChange={(e) =>
                              setFieldValue("englishTitle", e.target.value)
                            }
                            id="outlined-basic"
                            name="englishTitle"
                            variant="outlined"
                            defaultValue={current.englishTitle}
                          />

                          {touched.englishTitle && errors.englishTitle ? (
                            <b className="text-danger mt-1">
                              {errors.englishTitle}
                            </b>
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
export default injectIntl(connect(null, brands.actions)(BrandsTable))
