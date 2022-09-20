/** @format */

import React, { useEffect, useMemo, useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { connect, shallowEqual, useSelector } from "react-redux"
import paginationFactory from "react-bootstrap-table2-paginator"
import { injectIntl } from "react-intl"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import { ToastContainer, toast } from "react-toastify"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import * as Yup from "yup"
import * as townships from "./_redux/townshipsRedux"
import { Select, Input } from "../../../../_metronic/_partials/controls"
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
  deleteTownship,
  createTownship,
  updateTownship,
  getAllTownships,
} from "./_redux/townshipsCrud"
import { getAllProvinces } from "../provinces/_redux/provincesCrud"
import TextField from "@material-ui/core/TextField"

const CustomerEditSchema = Yup.object().shape({
  title: Yup.string("پر کردن فیلد الزامی است")
    .required("پر کردن فیلد الزامی است")
    .typeError("پر کردن فیلد الزامی است"),
  provincId: Yup.string("پر کردن فیلد الزامی است")
    .required("پر کردن فیلد الزامی است")
    .typeError("پر کردن فیلد الزامی است"),
})

function TownshipsTable(props) {
  const user = useSelector((state) => state.auth)
  const { townships } = useSelector((state) => state.townships.townships)

  const [open, setOpen] = React.useState(false)
  const [current, setCurrent] = React.useState({ title: "", provincId: "" })
  const [editOpen, setEditOpen] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)
  const [provinces, setProvinces] = React.useState(null)
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [length, setLength] = React.useState(null)
  const [hasSearched, setHasSearched] = React.useState(false)

  const pagination = paginationFactory({
    totalSize: length,
    page,
    sizePerPage: limit,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    onPageChange: (e) => {
      const params = {
        page: e,
        limit,
      }
      getAllTownships(user, params)
        .then(async (res) => {
          await props.getAllTownships(res.data.data)
          setLength(res.data.length)
          setPage(e)
        })
        .catch(() => {
          toast.error("مشکلی در ارتباط با سزور وجود دارد")
        })
    },
    onSizePerPageChange: (e) => {
      if (hasSearched) {
        toast.error("امکان انجام این عملیات در زمان فیلتر وجود ندارد")
        return false
      } else if (!hasSearched) {
        let params = null
        if (page !== 1) {
          setPage(1)
          params = {
            page: 1,
            limit: e,
          }
        } else {
          params = {
            page,
            limit: e,
          }
        }
        getAllTownships(user, params)
          .then(async (res) => {
            await props.getAllTownships(res.data.data)
            setLimit(e)
            setLength(res.data.length)
            // toast.dismiss(toastId.current)
          })
          .catch(() => {
            // toast.dismiss(toastId.current)
            toast.error("مشکلی در ارتباط با سزور وجود دارد")
          })
      }
    },
  })

  useEffect(() => {
    getAllProvinces(user).then((res) => setProvinces(res.data.data))
    const params = {
      page,
      limit,
    }
    getAllTownships(user, params).then((res) => {
      props.getAllTownships(res.data.data)
      setLength(res.data.length)
    })
  }, [])

  const handleEditClose = () => {
    setCurrent({ title: "", provincId: "" })
    setEditOpen(false)
    setEditMode(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setEditOpen(true)
  }

  const handleDelete = (current) => {
    setOpen(false)
    deleteTownship(user, current.id).then((res) => {
      getAllTownships(user).then((res) => props.getAllTownships(res.data.data))
    })
    toast.success("شهر با موفقیت حذف شد")
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
      text: "شهر",
      sort: true,
      // filter: textFilter()
      sortCaret: sortCaret,
    },
    {
      dataField: "Province.title",
      text: "استان",
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
              overlay={<Tooltip id="products-edit-tooltip">ویرایش شهر</Tooltip>}
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
              overlay={<Tooltip id="products-delete-tooltip">حذف شهر</Tooltip>}
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
          <CardHeader title="لیست شهر ها  ">
            <CardHeaderToolbar>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleOpen()
                }}
              >
                شهر جدید
              </button>
            </CardHeaderToolbar>
          </CardHeader>
          <CardBody>
            {townships != undefined
              ? Table({
                  data: townships,
                  columns: columns,
                  pagination: pagination,
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
            {"آیا واقعا قصد حذف این شهر را دارید ؟"}
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
          initialValues={{ title: "", provincId: "" }}
          validationSchema={CustomerEditSchema}
          onSubmit={(values) => {
            if (!editMode) {
              createTownship(user, values)
                .then((res) => {
                  getAllTownships(user).then((res) =>
                    props.getAllTownships(res.data.data)
                  )

                  toast.success("شهر جدبد با موفقیت اضافه شد")
                  values.title = ""
                })
                .catch(() => {
                  toast.error("خطایی رخ داده است")
                })
              setCurrent({})
              setEditOpen(false)
            } else if (editMode) {
              const updateData = {
                title: values.title,
                ProvincId: values.provincId,
              }
              updateTownship(user, current.id, updateData)
                .then((res) => {
                  getAllTownships(user).then((res) =>
                    props.getAllTownships(res.data.data)
                  )

                  toast.success("شهر با موفقیت ویرایش شد")
                  values.title = ""
                })
                .catch(() => {
                  toast.error("خطایی رخ داده است")
                })
              setCurrent({})
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
                    {editMode ? "ویرایش شهر" : "افزودن شهر"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {!current ? null : (
                    <Form className="form form-label-right">
                      <div className="form-group row">
                        <div className="col-lg-6 d-flex flex-column">
                          <label htmlFor="">نام شهر</label>
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
                          <label>استان را انتخاب کنید</label>
                          <Select name="provincId">
                            <option>انتخاب کنید</option>
                            {!provinces
                              ? null
                              : provinces.map((el) => {
                                  return (
                                    <option key={el.id} value={el.id}>
                                      {el.title}
                                    </option>
                                  )
                                })}
                          </Select>
                          {touched.provincId ? (
                            <div className="text-danger">
                              {errors.provincId}
                            </div>
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
export default injectIntl(connect(null, townships.actions)(TownshipsTable))
