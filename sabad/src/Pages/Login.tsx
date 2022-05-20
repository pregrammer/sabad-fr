import "../Styles/login.scss";
import logo from "../logo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../Components/Contexts/AuthProvider";
import axios from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useMsgCount } from "../Components/Contexts/MsgCountProvider";

function Login() {
  const { setAuth } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {setRefreshCount} = useMsgCount()

  const navigate = useNavigate();
  const location: any = useLocation();
  const from = location.state?.from?.pathname || "/panel/reports";

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("آدرس ایمیل نامعتبر است")
        .required("وارد کردن ایمیل الزامی است"),
      password: Yup.string().required("وارد کردن رمز عبور الزامی است"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          "/auth/login",
          JSON.stringify(values),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setIsLoading(false);

        if (response.status === 200) {
          setAuth(response.data.user);
          setRefreshCount((prev: boolean) => !prev);
          navigate(from, { replace: true });
        }
      } catch (error: any) {
        setIsLoading(false);
        if (!error.response) {
          toast.error("از اتصال اینترنت خود اطمینان حاصل نمایید", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    },
  });

  useEffect(() => {
    if (emailRef && emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="login-page">
        <form
          onSubmit={formik.handleSubmit}
          className={
            window.screen.width > 480 ? "login-form" : "login-form login-mobile"
          }
        >
          <img src={logo} alt="logo" />

          <p>سامانه ی برنامه ریزی درسی (سبد)</p>

          <label htmlFor="email">ایمیل:</label>
          {formik.touched.email && formik.errors.email && (
            <span className="error">{formik.errors.email}</span>
          )}
          <br />
          <input
            type="email"
            id="email"
            ref={emailRef}
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <label htmlFor="password">رمز عبور:</label>
          {formik.touched.password && formik.errors.password && (
            <span className="error">{formik.errors.password}</span>
          )}
          <br />
          <input
            type="password"
            id="password"
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <button type="submit">
            ورود{isLoading && <div className="login-loader"></div>}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
