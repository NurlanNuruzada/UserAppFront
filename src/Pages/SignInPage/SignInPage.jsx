import React, { useEffect, useState } from "react";
import Styles from "./SignInPage.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../../Service/AuthService";
import { loginAction } from "../../Redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress } from "@chakra-ui/react";
import jwtDecode from "jwt-decode";
import { setUserCreditinals } from "../../Redux/Slices/UserCreditionals";

export default function SignInPage() {
  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    username: Yup.string().required("Required").max(255),
    password: Yup.string().required("Required").max(100),
  });

  const LoginFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      LoginMutate(values);
      LoginFormik.handleReset();
    },
  });

  const { mutate: LoginMutate, isLoading: Loginloading } = useMutation(
    (values) => login(values),
    {
      onSuccess: (resp) => {
        dispatch(loginAction(resp));

        const decodedToken = jwtDecode(resp?.data?.token);
        const Id = decodedToken.UserId;
        const UserName = decodedToken.UserName;
        dispatch(setUserCreditinals({
          Id,
          UserName,
        }));

        navigate("/");
      },
      onError: () => {
        setLoginError("Sign-in identifier or password is wrong!");
      },
    }
  );

  const handleInputChange = (e) => {
    LoginFormik.handleChange(e);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (loginError) {
      const timer = setTimeout(() => {
        setLoginError(null);
      }, 1500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [loginError]);

  return (
    <div className={Styles.Container}>
      <div className={Styles.Main}>
        <Form className={Styles.Control} onSubmit={LoginFormik.handleSubmit}>
          <Form.Group controlId="login-username">
            <Form.Control
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              onBlur={LoginFormik.handleBlur}
              value={LoginFormik.values.username}
              isInvalid={!!LoginFormik.errors.username && LoginFormik.touched.username}
              className={Styles.Input}
            />
            <Form.Control.Feedback type="invalid">
              {LoginFormik.errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className={Styles.Control} controlId="login-password">
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                onBlur={LoginFormik.handleBlur}
                value={LoginFormik.values.password}
                isInvalid={!!LoginFormik.errors.password && LoginFormik.touched.password}
                className={Styles.Input}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={toggleShowPassword}
                className={Styles.passwordToggleIcon}
                style={{
                  position: "absolute",
                  inset: LoginFormik.errors.password && LoginFormik.touched.password ? "16% 83%" : "27% 90%",
                  cursor: "pointer",
                  color: "#007bff",
                }}
              />
              <Form.Control.Feedback type="invalid">
                {LoginFormik.errors.password}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Button
            type="submit"
            className={Styles.SubmitButton}
            variant="primary"
            disabled={Loginloading}
          >
            {Loginloading ? (
              <CircularProgress isIndeterminate size="24px" color="#579dff" />
            ) : (
              "Log in"
            )}
          </Button>

          {loginError && (
            <div style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
              {loginError}
            </div>
          )}
        </Form>

        {/* <div
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => navigate("/Register")}
          className="mt-1 text-center"
        >
          Create an account
        </div> */}
      </div>
    </div>
  );
}
