import React, { useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
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
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { connect, shallowEqual, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import * as directionDetails from "./_redux/detailsRedux";
import {
  getAllDirectionDetails,
  createDirectionDetail,
  deleteDirectionDetail,
  updateDirectionDetail,
  DirectionDetailFilter,
  getAllStations,
} from "./_redux/detailsCrud";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../_metronic/_partials/controls";
import { ToastContainer, toast } from "react-toastify";
import Filter from "../../../../_metronic/layout/components/filtering/filter";
import * as columnFormatters from "./formatters";

// Validation schema
const yupValidationSchema = Yup.object().shape({
  stationId: Yup.number()
    .required("این فیلد نمیتواند خالی باشد")
    .typeError("لطفا یکی از موارد اده شده را انتخاب کنید"),
  stationOrder: Yup.number()
    .required("این فیلد نمیتواند خالی باشد")
    .typeError("فرمت وارد شده باید عدد باشد"),
  distanceFromSource: Yup.number()
    .required("این فیلد نمیتواند خالی باشد")
    .typeError("فرمت وارد شده باید عدد باشد"),
  duration: Yup.number()
    .required("این فیلد نمیتواند خالی باشد")
    .typeError("فرمت وارد شده باید عدد باشد"),
  factor: Yup.number()
    .min(0, "ضریب باید بین ۰ و ۱ باشد")
    .max(1, "ضریب باید بین ۰ و ۱ باشد")
    .required("این فیلد نمیتواند خالی باشد")
    .typeError("فرمت وارد شده باید عدد باشد"),
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DirectionDetailsTable(props) {
  let { state } = useSelector(
    (state) => ({
      state: state.details,
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
  const [stations, setStations] = React.useState(null);

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
      getAllDirectionDetails(user, params)
        .then(async (res) => {
          await props.getAllDirectionDetails(res.data.data);
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
        getAllDirectionDetails(user, params)
          .then(async (res) => {
            await props.getAllDirectionDetails(res.data.data);
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
      props.getAllDirectionDetails(res.data.data);
      toast.dismiss(toastId.current);
    } else {
      setLimit(0);
      setLength(0);
      props.getAllDirectionDetails([]);
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
    getAllDirectionDetails(user, params)
      .then((res) => {
        props.getAllDirectionDetails(res.data.data);
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
    const directionId = props.match.params.id;
    // toastId.current = toast("در حال دریافت اطلاعات...", {
    //   autoClose: false,
    // });
    const params = {
      directionId,
      page,
      limit,
    };
    getAllDirectionDetails(user, params)
      .then((res) => {
        console.log("resssssssssssss", res.data.data);
        props.getAllDirectionDetails(res.data.data);
        setLength(res.data.length);
        // toast.dismiss(toastId.current);
        // toast.success("دیتا با موفقیت دریافت شد");
      })
      .catch(() => {
        toast.dismiss(toastId.current);
        toast.error("مشکلی در دریافت دیتا بوجود آمد");
      });

    getAllStations(user).then((res) => {
      setStations(res.data.data);
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
      formatter: columnFormatters.DirectionFormatter,
      sort: true,
      // filter: textFilter()
      sortCaret: sortCaret,
    },
    {
      dataField: "Station.title",
      text: "عنوان ایستگاه",
      sort: true,
      // filter: textFilter()
      sortCaret: sortCaret,
    },
    {
      dataField: "stationOrder",
      text: "ترتیب ایستگاه",
      sort: true,
      // filter: textFilter()
      sortCaret: sortCaret,
    },
    {
      dataField: "factor",
      text: "ضریب سختی مسیر",
      sort: true,
      // filter: textFilter()
      sortCaret: sortCaret,
    },
    {
      dataField: "distanceFromSource",
      text: "مسافت از مبدا",
      sort: true,
      formatter: columnFormatters.DistanceFormatter,
      // filter: textFilter()
      sortCaret: sortCaret,
    },
    {
      dataField: "duration",
      text: "مدت زمان طی ایستگاه",
      sort: true,
      formatter: columnFormatters.TimeFormatter,
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
                <Tooltip id="products-edit-tooltip">ویرایش جزییات مسیر</Tooltip>
              }
            >
              <a
                style={{ width: 25, height: 25 }}
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                onClick={() => {
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
              overlay={
                <Tooltip id="products-delete-tooltip">حذف جزییات مسیر</Tooltip>
              }
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
          </>
        );
      },
      sort: true,
    },
  ];

  const handleClickOpen = () => {
    setEditMode(false);
    setEditOpen(true);
    setCurrent({});
  };

  const removeDirectionDetail = (id) => {
    const params = {
      page,
      limit,
    };
    deleteDirectionDetail(user, current.id)
      .then((res) => {
        toast.success("جزییات مسیر با موفقیت حذف شد");
        if (hasSearched) {
          DirectionDetailFilter(user, searchParams).then((res) => {
            props.getAllDirectionDetails(res.data.data);
            setLength(res.data.length);
            setLimit(res.data.length);
          });
        } else if (!hasSearched) {
          getAllDirectionDetails(user, params).then((res) => {
            props.getAllDirectionDetails(res.data.data);
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
        <CardHeader title="لیست جزییات مسیر ها">
          <CardHeaderToolbar>
            <Link to="/directions">
              <button
                style={{ marginLeft: 10 }}
                type="button"
                className="btn btn-primary"
              >
                بازگشت
              </button>
            </Link>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                handleClickOpen();
              }}
            >
              جزییات مسیر جدید
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <Filter
            isRtl={true}
            getAllServiceFunction={getAllDirectionDetails}
            filterServiceFunction={DirectionDetailFilter}
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
                state.directionDetails.length != 0
                  ? state.directionDetails.directionDetails
                  : []
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
          {"آیا واقعا قصد حذف این جزییات مسیر را دارید ؟"}
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
            onClick={() => removeDirectionDetail(current.id)}
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
          const directionId = props.match.params.id;

          values.directionId = props.match.params.id;

          const params = {
            directionId,
            page,
            limit,
          };
          if (!editMode) {
            createDirectionDetail(user, values)
              .then((res) => {
                toast.success("جزییات مسیر با موفقیت اضافه شد");
                if (hasSearched) {
                  DirectionDetailFilter(user, searchParams).then((res) => {
                    props.getAllDirectionDetails(res.data.data);
                    setLength(res.data.length);
                    setLimit(res.data.length);
                  });
                } else if (!hasSearched) {
                  getAllDirectionDetails(user, params).then((res) => {
                    props.getAllDirectionDetails(res.data.data);
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
            updateDirectionDetail(user, current.id, values)
              .then((res) => {
                toast.success("جزییات مسیر با موفقیت تغییر یافت");
                if (hasSearched) {
                  DirectionDetailFilter(user, searchParams).then((res) => {
                    props.getAllDirectionDetails(res.data.data);
                    setLength(res.data.length);
                    setLimit(res.data.length);
                  });
                } else if (!hasSearched) {
                  getAllDirectionDetails(user, params).then((res) => {
                    props.getAllDirectionDetails(res.data.data);
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
        {({ handleSubmit, errors, touched, isSubmitting, initialValues }) => (
          <>
            <Modal show={editOpen} onHide={handleEditClose}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {editMode ? "ویرایش جزییات مسیر" : "افزودن جزییات مسیر"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {!current ? null : (
                  <Form className="form form-label-right">
                    <div className="form-group row">
                      <div className="col-lg-6">
                        <Select name="stationId" label="ایستگاه">
                          <option>ایستگاه</option>

                          {stations != null ? (
                            stations.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.title}
                              </option>
                            ))
                          ) : (
                            <option></option>
                          )}
                        </Select>
                        {touched.stationId ? (
                          <h6 className="text-danger mt-1">
                            {errors.stationId}
                          </h6>
                        ) : null}
                      </div>
                      <div className="col-lg-6">
                        <Field
                          name="stationOrder"
                          component={Input}
                          placeholder="ترتیب ایستگاه"
                          label="ترتیب ایستگاه"
                        />
                        {touched.stationOrder ? (
                          <h6 className="text-danger mt-1">
                            {errors.stationOrder}
                          </h6>
                        ) : null}
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-6">
                        <Field
                          name="distanceFromSource"
                          component={Input}
                          placeholder="مسافت از مبدا"
                          label="مسافت از مبدا"
                        />
                        {touched.distanceFromSource ? (
                          <h6 className="text-danger mt-1">
                            {errors.distanceFromSource}
                          </h6>
                        ) : null}
                      </div>
                      <div className="col-lg-6">
                        <Field
                          name="duration"
                          component={Input}
                          placeholder="مدت زمان طی ایستگاه"
                          label="مدت زمان طی ایستگاه"
                        />
                        {touched.duration ? (
                          <h6 className="text-danger mt-1">
                            {errors.duration}
                          </h6>
                        ) : null}
                      </div>

                      <div className="col-lg-6 mt-1">
                        <Field
                          type="number"
                          name="factor"
                          component={Input}
                          placeholder="ضریب سختی مسیر"
                          label="ضریب سختی مسیر"
                        />
                        {touched.factor ? (
                          <h6 className="text-danger mt-1">{errors.factor}</h6>
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
                    handleEditClose();
                  }}
                >
                  انصراف
                </Button>

                <Button
                  className="btn btn-primary"
                  variant="primary"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit()}
                >
                  ثبت
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Formik>
    </>
  );
}
export default injectIntl(
  connect(null, directionDetails.actions)(DirectionDetailsTable)
);
