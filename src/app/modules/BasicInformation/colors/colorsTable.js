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
import * as colors from "./_redux/colorsRedux"
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
  deleteColor,
  createColor,
  updateColor,
  getAllColors,
} from "./_redux/colorsCrud"
import TextField from "@material-ui/core/TextField"

const CustomerEditSchema = Yup.object().shape({
  title: Yup.string("پر کردن فیلد الزامی است")
    .required("پر کردن فیلد الزامی است")
    .typeError("پر کردن فیلد الزامی است"),
  colorCode: Yup.string("پر کردن فیلد الزامی است")
    .required("پر کردن فیلد الزامی است")
    .typeError("پر کردن فیلد الزامی است"),
})

function ColorsTable(props) {
  const { user } = useSelector((state) => state.auth)
  const { colors } = useSelector((state) => state.colors.colors)

  const [open, setOpen] = React.useState(false)
  const [current, setCurrent] = React.useState({ title: "", colorCode: "" })
  const [editOpen, setEditOpen] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)

  const toastId = React.useRef(null)

  useEffect(() => {
    getAllColors(user).then((res) => props.getAllColors(res.data.data))
  }, [])

  const handleEditClose = () => {
    setCurrent({ title: "", colorCode: "" })
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
    deleteColor(user, current.id)
    toast.success("رنگ با موفقیت حذف شد")
    getAllColors(user).then((res) => props.getAllColors(res.data.data))
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
      text: "رنگ",
      sort: true,
      // filter: textFilter()
      sortCaret: sortCaret,
    },
    {
      dataField: "colorCode",
      text: "کد رنگ",
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
              overlay={<Tooltip id="products-edit-tooltip">ویرایش رنگ</Tooltip>}
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
              overlay={<Tooltip id="products-delete-tooltip">حذف رنگ</Tooltip>}
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
          <CardHeader title="لیست رنگ ها ">
            <CardHeaderToolbar>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleOpen()
                }}
              >
                رنگ جدید
              </button>
            </CardHeaderToolbar>
          </CardHeader>
          <CardBody>
            {colors != undefined
              ? Table({
                  data: colors,
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
            {"آیا واقعا قصد حذف این رنگ را دارید ؟"}
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
          initialValues={{ title: "", colorCode: "" }}
          validationSchema={CustomerEditSchema}
          onSubmit={(values) => {
            if (!editMode) {
              createColor(user, values)
                .then((res) => {
                  getAllColors(user).then((res) =>
                    props.getAllColors(res.data.data)
                  )

                  toast.success("رنگ جدبد با موفقیت اضافه شد")
                  values.title = ""
                  values.colorCode = ""
                })
                .catch(() => {
                  toast.error("خطایی رخ داده است")
                })
              setCurrent({ title: "", colorCode: "" })
              setEditOpen(false)
            } else if (editMode) {
              const updateData = {
                title: values.title,
                colorCode: values.colorCode,
              }
              updateColor(user, current.id, updateData)
                .then((res) => {
                  getAllColors(user).then((res) =>
                    props.getAllColors(res.data.data)
                  )

                  toast.success("رنگ با موفقیت ویرایش شد")
                  values.title = ""
                  values.colorCode = ""
                })
                .catch(() => {
                  toast.error("خطایی رخ داده است")
                })
              setCurrent({ title: "", colorCode: "" })
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
                    {editMode ? "ویرایش رنگ" : "افزودن رنگ"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {!current ? null : (
                    <Form className="form form-label-right">
                      <div className="form-group row">
                        <div className="col-lg-6">
                          <label htmlFor="">رنگ</label>
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
                        <div className="col-lg-6">
                          <label htmlFor=""> کد رنگ (بدون #)</label>
                          <TextField
                            onChange={(e) =>
                              setFieldValue("colorCode", e.target.value)
                            }
                            id="outlined-basic"
                            name="colorCode"
                            variant="outlined"
                            defaultValue={current.colorCode}
                          />
                          {touched.colorCode && errors.colorCode ? (
                            <b className="text-danger mt-1">
                              {errors.colorCode}
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
export default injectIntl(connect(null, colors.actions)(ColorsTable))
