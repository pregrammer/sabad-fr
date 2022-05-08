import "../../Styles/editProfile.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../Contexts/AuthProvider";
import LoadingModal from "./LoadingModal";
import useAxiosFunction from "../../Helpers/useAxiosFunction";
import { useEffect } from "react";

function EditProfile({ setIsEditProfileOpen, editProfileRef }: any) {
  const { auth, setAuth } = useAuth();
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  const formik = useFormik({
    initialValues: {
      firstName: auth.firstName,
      lastName: auth.lastName,
      email: auth.email,
      phoneNumber: auth.phoneNumber,
      password: "",
      pass_confirm: "",
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
        .max(100, "حداکثر تعداد کاراکتر 100 می باشد"),
      phoneNumber: Yup.string()
        .required("وارد کردن شماره تلفن الزامی است")
        .max(18, "حداکثر تعداد کاراکتر 18 می باشد"),
      password: Yup.string().max(150, "حداکثر تعداد کاراکتر 150 می باشد"),
      pass_confirm: Yup.string()
        .when("password", {
          is: (password: any) => (password ? true : false),
          then: Yup.string().required("وارد کردن تکرار رمز عبور الزامی است"),
        })
        .oneOf(
          [Yup.ref("password"), null],
          "رمز عبور با تکرار آن همخوانی ندارد"
        ),
    }),
    onSubmit: (values) => {
      const dataPut = {
        id: auth.id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      };

      axiosFetch({
        method: "PUT",
        url: "/users",
        requestConfig: {
          headers: {
            "Content-Type": "application/json",
          },
          data: dataPut,
        },
      });
    },
  });

  // if data changed, means our request is successful; and we do further here.
  // the if is for not including the first render
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
      setAuth((prev: any) => ({
        ...prev,
        email: formik.values.email,
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        phoneNumber: formik.values.phoneNumber,
      }));
      setIsEditProfileOpen((prev: any) => !prev);
    }
  }, [data]);

  return (
    <>
      <div
        className="bgc-modal"
        onClick={() => setIsEditProfileOpen((prev: any) => !prev)}
      ></div>
      <div className="edit-profile-content" ref={editProfileRef}>
        <span
          className="close"
          onClick={() => setIsEditProfileOpen((prev: any) => !prev)}
        >
          &times;
        </span>
        <form onSubmit={formik.handleSubmit}>
          <h4>ویرایش مشخصات</h4>
          <div className="group">
            <input
              type="text"
              placeholder="نام"
              required
              id="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <span className="error">{formik.errors.firstName}</span>
            )}
            <input
              type="text"
              placeholder="نام خانوادگی"
              required
              id="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <span className="error-right">{formik.errors.lastName}</span>
            )}
          </div>
          <div className="group">
            <input
              type="email"
              placeholder="ایمیل"
              required
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <span className="error">{formik.errors.email}</span>
            )}

            <input
              type="text"
              pattern="[0-9]*"
              placeholder="شماره تلفن"
              required
              id="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <span className="error-right">{formik.errors.phoneNumber}</span>
            )}
          </div>
          <div className="group">
            <input
              type="password"
              placeholder="رمز عبور جدید"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <span className="error">{formik.errors.password}</span>
            )}
            <input
              type="password"
              placeholder="تکرار رمز عبور جدید"
              id="pass_confirm"
              value={formik.values.pass_confirm}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.pass_confirm && formik.errors.pass_confirm && (
              <span className="error-right">{formik.errors.pass_confirm}</span>
            )}
          </div>
          <button type="submit">ویرایش</button>
        </form>
      </div>
      {loading && <LoadingModal />}
    </>
  );
}

export default EditProfile;
