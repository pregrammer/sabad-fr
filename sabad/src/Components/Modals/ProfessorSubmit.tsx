import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadingModal from "./LoadingModal";
import useAxiosFunction from "../../Helpers/useAxiosFunction";
import { useEffect } from "react";

function ProfessorSubmit({ setEditOpen, editData, updateRows }: any) {
  const [fosList, fosLoading, axiosFetch2]: any = useAxiosFunction();
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  useEffect(() => {
    axiosFetch2({
      method: "GET",
      url: "/field_of_studies?forSelect=true",
    });
  }, []);

  const formik: any = useFormik({
    initialValues: {
      firstName: editData ? editData.firstName : "",
      lastName: editData ? editData.lastName : "",
      email: editData ? editData.email : "",
      kind: editData ? editData.isInvited : "0",
      lastGrade: editData ? editData.lastGrade : "1",
      phoneNumber: editData ? editData.phoneNumber : "",
      fos_user_submit: editData ? editData.field_of_study_id : "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("وارد کردن نام الزامی است")
        .max(50, "حداکثر تعداد کاراکتر 50 می باشد"),
      lastName: Yup.string()
        .required("وارد کردن نام خانوادگی الزامی است")
        .max(50, "حداکثر تعداد کاراکتر 50 می باشد"),
      email: Yup.string()
        .email("آدرس ایمیل نامعتبر است")
        .required("وارد کردن ایمیل الزامی است")
        .max(150, "حداکثر تعداد کاراکتر 150 می باشد"),
      phoneNumber: Yup.string()
        .required("وارد کردن شماره تلفن الزامی است")
        .max(18, "حداکثر تعداد کاراکتر 18 می باشد"),
    }),
    onSubmit: (values) => {
      // fos: because we first put fos to "" and if select doesnt trigger, fos remain "".
      if (!editData) {
        axiosFetch({
          method: "POST",
          url: "/professors",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              isInvited: values.kind,
              lastGrade: values.lastGrade,
              phoneNumber: values.phoneNumber,
              field_of_study_id:
                values.fos_user_submit === ""
                  ? fosList[0].id
                  : values.fos_user_submit,
            },
          },
        });
      } else {
        const dataPut = {
          id: editData.id,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          isInvited: values.kind,
          lastGrade: values.lastGrade,
          phoneNumber: values.phoneNumber,
          field_of_study_id:
            values.fos_user_submit === ""
              ? fosList[0].id
              : values.fos_user_submit,
        };
        axiosFetch({
          method: "PUT",
          url: "/professors",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: dataPut,
          },
        });
      }
    },
  });

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      toast.success(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      updateRows((prev: any) => !prev);
      setEditOpen((prev: any) => !prev);
    }
  }, [data]);

  return (
    <>
      <div
        className="bgc-modal"
        onClick={() => setEditOpen((prev: any) => !prev)}
      ></div>
      <div className="professor-submit-content">
        <span
          className="close"
          onClick={() => setEditOpen((prev: any) => !prev)}
        >
          &times;
        </span>
        <form onSubmit={formik.handleSubmit}>
          <h4>{editData ? "ویرایش" : "افزودن"} استاد</h4>
          <div className="group">
            <div>
              <label>نام:</label>
              <input
                type="text"
                required
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.firstName && formik.errors.firstName && (
              <span className="error">{formik.errors.firstName}</span>
            )}
            <div>
              <label>نام خانوادگی:</label>
              <input
                type="text"
                required
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.lastName && formik.errors.lastName && (
              <span className="error-right">{formik.errors.lastName}</span>
            )}
          </div>
          <div className="group">
            <div>
              <label>ایمیل:</label>
              <input
                type="email"
                required
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <span className="error">{formik.errors.email}</span>
            )}

            <div>
              <label>شماره تلفن:</label>
              <input
                type="text"
                pattern="[0-9]*"
                required
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <span className="error-right">{formik.errors.phoneNumber}</span>
            )}
          </div>
          <div className="group">
            <div>
              <label>مدرک:</label>
              <select
                name="kind"
                value={formik.values.kind}
                onChange={formik.handleChange}
              >
                <option value="0">هیات علمی</option>
                <option value="1">مدعو</option>
              </select>
            </div>
            <div>
              <label>رشته:</label>
              <select
                name="fos_user_submit"
                value={formik.values.fos_user_submit}
                onChange={formik.handleChange}
              >
                {!fosLoading &&
                  fosList &&
                  fosList.map((fos: any) => (
                    <option value={fos.id} key={fos.id}>
                      {fos.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="group">
            <div>
              <label>مدرک:</label>
              <select
                name="lastGrade"
                value={formik.values.lastGrade}
                onChange={formik.handleChange}
              >
                <option value="1">کارشناسی</option>
                <option value="2">کارشناسی ارشد</option>
                <option value="3">دکتری</option>
              </select>
            </div>
          </div>
          <button type="submit">{editData ? "ویرایش" : "افزودن"}</button>
        </form>
      </div>
      {(loading || fosLoading) && <LoadingModal />}
    </>
  );
}

export default ProfessorSubmit;
