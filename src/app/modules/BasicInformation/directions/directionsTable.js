import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Redirect, Switch, Route, useLocation } from "react-router-dom";
import { AuthPage } from "../../../modules/Auth";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, sortCaret } from "../../../../_metronic/_helpers";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import * as columnFormatters from "./formatters";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { connect, shallowEqual, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import * as directions from "./_redux/directionsRedux";
import {
  getAllDirections,
  createDirection,
  deleteDirection,
  updateDirection,
  DirectionFilter,
} from "./_redux/directionsCrud";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../_metronic/_partials/controls";
import { ToastContainer, toast } from "react-toastify";
import Filter from "../../../../_metronic/layout/components/filtering/filter";
import { getAllTownships } from "../townships/_redux/townshipsCrud";

// Validation schema
const yupValidationSchema = Yup.object().shape({
  sourceTownshipId: Yup.number()
    .notOneOf([Yup.ref("destTownshipId"), null], "مقصد و مبدا همسانند")
    .required("این فیلد نمیتواند خالی باشد")
    .typeError("یکی از موارد داده شده را انتخاب کنید"),
  destTownshipId: Yup.number()
    .notOneOf([Yup.ref("sourceTownshipId"), null], "مقصد و مبدا همسانند")
    .required("این فیلد نمیتواند خالی باشد")
    .typeError("یکی از موارد داده شده را انتخاب کنید"),
  isActive: Yup.number()
    .required("این فیلد نمیتواند خالی باشد")
    .typeError("یکی از موارد داده شده را انتخاب کنید"),
  distance: Yup.number()
    .required("این فیلد نمیتواند خالی باشد")
    .typeError("فرمت وارد شده صحیح نیست"),
  durationOverDistance: Yup.number()
    .required("این فیلد نمیتواند خالی باشد")
    .typeError("فرمت وارد شده صحیح نیست"),
  basePrice: Yup.number()
    .required("این فیلد نمی تواند خالی باشد")
    .typeError("فرمت وارد شده صحیح نیست"),
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DirectionsTable(props) {
  let { state } = useSelector(
    (state) => ({
      state: state.directions,
    }),
    shallowEqual
  );
  const { user } = useSelector((state) => state.auth);

  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [current, setCurrent] = React.useState({});
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [length, setLength] = React.useState(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [searchParams, setSearchParams] = React.useState(null);
  const [townships, setTownships] = React.useState(null);
  const [sameSourceAndDest, setSameSourceAndDest] = React.useState(false);

  const history = useHistory();

  const toastId = React.useRef(null);

  const pagination = paginationFactory({
    totalSize: length,
    page,
    sizePerPage: limit,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    onPageChange: (e) => {
      // toastId.current = toast("در حال دریافت اطلاعات...", {
      //   autoClose: false,
      // });

      const params = {
        page: e,
        limit,
      };
      getAllDirections(user, params)
        .then(async (res) => {
          await props.getAllDirections(res.data.data);
          setLength(res.data.length);
          setPage(e);
          toast.dismiss(toastId.current);
        })
        .catch(() => {
          toast.dismiss(toastId.current);
          toast.error("مشکلی در ارتباط با سزور وجود دارد");
        });
    },
    onSizePerPageChange: (e) => {
      if (hasSearched) {
        toast.error("امکان انجام این عملیات در زمان فیلتر وجود ندارد");
        return false;
      } else if (!hasSearched) {
        // toastId.current = toast("در حال دریافت اطلاعات...", {
        //   autoClose: false,
        // });
        let params = null;
        if (page !== 1) {
          setPage(1);
          params = {
            page: 1,
            limit: e,
          };
        } else {
          params = {
            page,
            limit: e,
          };
        }
        getAllDirections(user, params)
          .then(async (res) => {
            await props.getAllDirections(res.data.data);
            setLimit(e);
            setLength(res.data.length);
            toast.dismiss(toastId.current);
          })
          .catch(() => {
            toast.dismiss(toastId.current);
            toast.error("مشکلی در ارتباط با سزور وجود دارد");
          });
      }
    },
  });

  //filterHandler
  const filterHandler = (res) => {
    // toastId.current = toast("در حال دریافت اطلاعات...", {
    //   autoClose: false,
    // });

    setHasSearched(true);
    if (res.data.length !== 0) {
      setPage(1);
      setLimit(res.data.length);
      setLength(res.data.length);
      props.getAllDirections(res.data.data);
      toast.dismiss(toastId.current);
    } else {
      setLimit(0);
      setLength(0);
      props.getAllDirections([]);
      toast.dismiss(toastId.current);
      toast.error("!دیتایی یافت نشد");
    }
  };

  //filterErrorHandler
  const filterErrorHandler = () => {
    toast.error("مشکلی در ارتباط با سزوز بوجود آمد");
  };

  //filterCleanerHandler
  const filterCleanerHandler = () => {
    // toastId.current = toast("در حال دریافت اطلاعات...", {
    //   autoClose: false,
    // });

    setPage(1);
    setLimit(10);
    const params = {
      page: 1,
      limit: 10,
    };
    getAllDirections(user, params)
      .then((res) => {
        props.getAllDirections(res.data.data);
        setLength(res.data.length);
        toast.dismiss(toastId.current);
      })
      .catch(() => {
        toast.dismiss(toastId.current);
        toast.error("مشکلی در ارتباط با سزوز بوجود آمد");
      });
    setHasSearched(false);
  };

  React.useEffect(() => {
    // toastId.current = toast("در حال دریافت اطلاعات...", {
    //   autoClose: false,
    // });
    const params = {
      page,
      limit,
    };
    getAllDirections(user, params)
      .then((res) => {
        props.getAllDirections(res.data.data);
        setLength(res.data.length);
        // toast.dismiss(toastId.current);
        // toast.success("دیتا با موفقیت دریافت شد");
      })
      .catch(() => {
        toast.dismiss(toastId.current);
        toast.error("مشکلی در دریافت دیتا بوجود آمد");
      });

    getAllTownships(user).then((res) => {
      setTownships(res.data.data);
    });
  }, []);

  const columns = [
    {
      dataField: "id",
      text: "شناسه",
      sort: true,
      sortCaret: sortCaret,
      // filter: textFilter()
    },
    {
      dataField: "sourceTownshipTitle",
      text: "عنوان مسیر",
      sort: true,
      formatter: columnFormatters.DirectionFormatter,

      // filter: textFilter()
      sortCaret: sortCaret,
    },
    {
      dataField: "distance",
      text: "مسافت",
      sort: true,
      formatter: columnFormatters.DistanceFormatter,
      // filter: textFilter()
      sortCaret: sortCaret,
    },
    {
      dataField: "durationOverDistance",
      text: "مدت زمان سفر",
      formatter: columnFormatters.TimeFormatter,
      sort: true,
      // filter: textFilter()
      sortCaret: sortCaret,
    },
    {
      dataField: "basePrice",
      text: "مبلغ سفر",
      sort: true,
      // filter: textFilter()
      sortCaret: sortCaret,
    },
    {
      dataField: "isActive",
      formatter: columnFormatters.StatusFormatter,

      text: "وضعیت",
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
                <Tooltip id="products-edit-tooltip">ویرایش مسیر</Tooltip>
              }
            >
              <a
                style={{ width: 25, height: 25 }}
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                onClick={() => {
                  console.log("rowow", row);
                  setCurrent(row);
                  setEditOpen(true);
                  setEditMode(true);
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
              overlay={<Tooltip id="products-delete-tooltip">حذف مسیر</Tooltip>}
            >
              <a
                style={{ width: 25, height: 25 }}
                className="btn btn-icon btn-light btn-hover-danger btn-sm"
                onClick={() => {
                  setCurrent(row);
                  setOpen(true);
                }}
              >
                <span className="svg-icon svg-icon-md svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                  />
                </span>
              </a>
            </OverlayTrigger>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-delete-tooltip">جزییات مسیر</Tooltip>
              }
            >
              <a
                style={{ width: 25, height: 25, marginRight: 10 }}
                className="btn btn-icon btn-light btn-hover-success btn-sm"
                onClick={() => history.push("/details/" + row.id)}
              >
                <span className="svg-icon svg-icon-md svg-icon-success">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/svg/icons/General/Attachment1.svg"
                    )}
                  />
                </span>
              </a>
            </OverlayTrigger>
          </>
        );
      },
      sort: true,
    },
  ];

  const destAndSourceSetter = (values) => {
    let copied = values;
    copied.destTownshipId = values.destTownshipId;
    copied.sourceTownshipId = values.sourceTownshipId;
    return copied;
  };

  const handleClickOpen = () => {
    setEditMode(false);
    setEditOpen(true);
    setCurrent({});
  };

  const removeDirection = (id) => {
    const params = {
      page,
      limit,
    };
    deleteDirection(user, current.id)
      .then((res) => {
        toast.success("مسیر با موفقیت حذف شد");
        if (hasSearched) {
          DirectionFilter(user, searchParams).then((res) => {
            props.getAllDirections(res.data.data);
            setLength(res.data.length);
            setLimit(res.data.length);
          });
        } else if (!hasSearched) {
          getAllDirections(user, params).then((res) => {
            props.getAllDirections(res.data.data);
            setLength(res.data.length);
          });
        }
      })
      .catch((err) => {
        toast.error("مشکلی در ارتباط با سزور وجود دارد");
      });
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleEditClose = () => {
    setSameSourceAndDest(false);
    setCurrent(null);
    setEditOpen(false);
    setEditMode(false);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        rtl={true}
        pauseOnHover
      />
      <Card>
        <CardHeader title="لیست مسیر ها">
          <CardHeaderToolbar>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                handleClickOpen();
              }}
            >
              مسیر جدید
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <Filter
            isRtl={true}
            getAllServiceFunction={getAllDirections}
            filterServiceFunction={DirectionFilter}
            dataStateSetter={filterHandler}
            filterCleaner={filterCleanerHandler}
            searchParamsSetter={setSearchParams}
            fields={[
              {
                name: "id",
                type: "number",
                placeholder: "شناسه",
                label: "شناسه",
              },
              {
                name: "title",
                type: "text",
                placeholder: "عنوان",
                label: "عنوان",
              },
            ]}
          />
          {!length ? null : (
            <ToolkitProvider
              keyField="id"
              data={
                state.directions.length != 0 ? state.directions.directions : []
              }
              columns={columns}
            >
              {(props) => (
                <div>
                  <BootstrapTable
                    noDataIndication="داده ای یافت نشد ابتدا از صحت اینترنت خود اطمینان حاصل بفرمایید و سپس صفحه را بروزرسانی کنید"
                    onDataSizeChange={(e) => {
                      return true;
                    }}
                    onTableChange={(e) => {
                      return true;
                    }}
                    loading={true}
                    remote={{
                      filter: true,
                      pagination: true,
                      sort: false,
                      cellEdit: true,
                    }}
                    bordered={false}
                    pagination={pagination}
                    {...props.baseProps}
                    bootstrap4
                  />
                </div>
              )}
            </ToolkitProvider>
          )}
        </CardBody>
      </Card>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"آیا واقعا قصد حذف این مسیر را دارید ؟"}
        </DialogTitle>
        <DialogContent style={{ borderBottom: "1px solid red" }}>
          <DialogContentText id="alert-dialog-slide-description"></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={() => removeDirection(current.id)}
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
        initialValues={current}
        validationSchema={yupValidationSchema}
        onSubmit={(values) => {
          const params = {
            page,
            limit,
          };
          if (!editMode) {
            createDirection(user, values)
              .then((res) => {
                toast.success("مسیر با موفقیت اضافه شد");
                if (hasSearched) {
                  DirectionFilter(user, searchParams).then((res) => {
                    props.getAllDirections(res.data.data);
                    setLength(res.data.length);
                    setLimit(res.data.length);
                  });
                } else if (!hasSearched) {
                  getAllDirections(user, params).then((res) => {
                    props.getAllDirections(res.data.data);
                    setLength(res.data.length);
                  });
                }
              })
              .catch(() => {
                toast.error("مشکلی در ارتباط با سزور وجود دارد");
              });
            setCurrent(null);
            setEditOpen(false);
          } else if (editMode) {
            updateDirection(user, current.id, values)
              .then((res) => {
                toast.success("مسیر با موفقیت تغییر یافت");
                if (hasSearched) {
                  DirectionFilter(user, searchParams).then((res) => {
                    props.getAllDirections(res.data.data);
                    setLength(res.data.length);
                    setLimit(res.data.length);
                  });
                } else if (!hasSearched) {
                  getAllDirections(user, params).then((res) => {
                    props.getAllDirections(res.data.data);
                    setLength(res.data.length);
                  });
                }
              })
              .catch(() => {
                toast.error("مشکلی در ارتباط با سزور وجود دارد");
              });
            setCurrent(null);
            setEditOpen(false);
            setEditMode(false);
          }
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          isSubmitting,
          values,
          setValues,
        }) => {
          return (
            <>
              <Modal show={editOpen} onHide={handleEditClose}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {editMode ? "ویرایش مسیر" : "افزودن مسیر"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {!current ? null : (
                    <Form className="form form-label-right">
                      <div className="form-group row">
                        <div className="col-lg-4">
                          <Select name="sourceTownshipId" label="مبدا">
                            <option>انتخاب شهر مبدا</option>

                            {townships ? (
                              townships.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.title}
                                </option>
                              ))
                            ) : (
                              <option></option>
                            )}
                          </Select>
                          {touched.sourceTownshipId ? (
                            <div className="text-danger">
                              {errors.sourceTownshipId}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-lg-4">
                          <Select name="destTownshipId" label="مقصد">
                            <option>انتخاب شهر مقصد</option>

                            {townships != null ? (
                              townships.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.title}
                                </option>
                              ))
                            ) : (
                              <option></option>
                            )}
                          </Select>
                          {touched.destTownshipId ? (
                            <div className="text-danger">
                              {errors.destTownshipId}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-lg-4">
                          <Select name="isActive" label="وضعیت">
                            <option>انتخاب وضعیت</option>
                            <option value={1}>فعال</option>
                            <option value={0}>غیر فعال</option>
                          </Select>
                          {touched.isActive ? (
                            <div className="text-danger">{errors.isActive}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-lg-4">
                          <Field
                            name="distance"
                            component={Input}
                            placeholder="مسافت"
                            label="مسافت"
                          />
                          {touched.distance ? (
                            <div className="text-danger">{errors.distance}</div>
                          ) : null}
                        </div>
                        <div className="col-lg-4">
                          <Field
                            name="durationOverDistance"
                            component={Input}
                            placeholder="مدت مسیر"
                            label="مدت مسیر"
                          />
                          {touched.durationOverDistance ? (
                            <div className="text-danger">
                              {errors.durationOverDistance}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-lg-4">
                          <Field
                            name="basePrice"
                            component={Input}
                            type="number"
                            placeholder="مبلغ مسیر"
                            label="مبلغ مسیر"
                          />
                          {touched.basePrice ? (
                            <div className="text-danger">
                              {errors.basePrice}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </Form>
                  )}
                  {sameSourceAndDest ? (
                    <div className="text-danger">مبدا و مقصد همسانند</div>
                  ) : null}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleEditClose();
                    }}
                  >
                    انصراف
                  </Button>

                  <Button
                    className="btn btn-primary"
                    variant="primary"
                    disabled={isSubmitting}
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    ثبت
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          );
        }}
      </Formik>
    </>
  );
}
export default injectIntl(connect(null, directions.actions)(DirectionsTable));
