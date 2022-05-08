import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadingModal from "./LoadingModal";
import useAxiosFunction from "../../Helpers/useAxiosFunction";
import { useEffect } from "react";

function UserSubmit({ setIsOpen, editData, updateRows }: any) {
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
      isEditDate: editData ? true : false,
      firstName: editData ? editData.firstName : "",
      lastName: editData ? editData.lastName : "",
      email: editData ? editData.email : "",
      phoneNumber: editData ? editData.phoneNumber : "",
      password: "",
      pass_confirm: "",
      role_user_submit: editData ? editData.role : "2",
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
        .max(100, "حداکثر تعداد کاراکتر 100 می باشد"),
      phoneNumber: Yup.string()
        .required("وارد کردن شماره تلفن الزامی است")
        .max(18, "حداکثر تعداد کاراکتر 18 می باشد"),
      password: Yup.string()
        .max(150, "حداکثر تعداد کاراکتر 150 می باشد")
        .when("isEditDate", {
          is: (isEditDate: any) => (isEditDate ? false : true),
          then: Yup.string().required("وارد کردن رمز عبور الزامی است"),
        }),
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
      // role: because we first put role to "" and if select doesnt trigger, role remain "".
      if (!editData) {
        axiosFetch({
          method: "POST",
          url: "/users",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              phoneNumber: values.phoneNumber,
              password: values.password,
              role: values.role_user_submit,
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
          phoneNumber: values.phoneNumber,
          password: values.password,
          role: values.role_user_submit,
          field_of_study_id:
            values.fos_user_submit === ""
              ? fosList[0].id
              : values.fos_user_submit,
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
      setIsOpen((prev: any) => !prev);
    }
  }, [data]);

  return (
    <>
      <div
        className="bgc-modal"
        onClick={() => setIsOpen((prev: any) => !prev)}
      ></div>
      <div className="user-submit-content">
        <span className="close" onClick={() => setIsOpen((prev: any) => !prev)}>
          &times;
        </span>
        <form onSubmit={formik.handleSubmit}>
          <h4>{editData ? "ویرایش" : "افزودن"} کاربر</h4>
          <div className="group">
            <div>
              <label htmlFor="">نام:</label>
              <input
                type="text"
                required
                id="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.firstName && formik.errors.firstName && (
              <span className="error">{formik.errors.firstName}</span>
            )}
            <div>
              <label htmlFor="">نام خانوادگی:</label>
              <input
                type="text"
                required
                id="lastName"
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
              <label htmlFor="">ایمیل:</label>
              <input
                type="email"
                required
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <span className="error">{formik.errors.email}</span>
            )}

            <div>
              <label htmlFor="">شماره تلفن:</label>
              <input
                type="text"
                pattern="[0-9]*"
                required
                id="phoneNumber"
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
              <label htmlFor="role_user_submit">سمت:</label>
              <select
                id="role_user_submit"
                value={formik.values.role_user_submit}
                onChange={formik.handleChange}
              >
                <option value="2">مدیر گروه تخصصی</option>
                <option value="3">مدیر گروه عمومی</option>
                <option value="4">کارشناس گروه</option>
              </select>
            </div>
            <div>
              <label htmlFor="fos_user_submit">رشته:</label>
              <select
                id="fos_user_submit"
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
            <input
              type="password"
              placeholder={editData ? "رمز عبور جدید" : "رمز عبور"}
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
              placeholder={editData ? "تکرار رمز عبور جدید" : "تکرار رمز عبور"}
              id="pass_confirm"
              value={formik.values.pass_confirm}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.pass_confirm && formik.errors.pass_confirm && (
              <span className="error-right">{formik.errors.pass_confirm}</span>
            )}
          </div>
          <button type="submit">{editData ? "ویرایش" : "افزودن"}</button>
        </form>
      </div>
      {(loading || fosLoading) && <LoadingModal />}
    </>
  );
}

export default UserSubmit;
