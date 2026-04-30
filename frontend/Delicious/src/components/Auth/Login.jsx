import { useState } from "react";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [alertErr, setAlertErr] = useState({ status: false, msg: "" });

  const navigate = useNavigate();

  const formSubmitHandler = async () => {
    if (phone.length !== 10) {
      setError("Phone must be exactly 10 digits");
      return;
    } else {
      setError("");
    }

    try {
      const res = await axios.post(`http://localhost:9000/loginUser`, {
        phone,
      });
      if (res.data.success) {
        localStorage.setItem('token', res.data.data?.token);
        localStorage.setItem('username', res.data.data?.username);
        toast.success("User login successfully");
        navigate("/");
      } else {
        setAlertErr({ status: true, msg: res?.data?.message });
      }
    } catch (err) {
      setAlertErr({ status: true, msg: "Something went wrong" });
    }
  };
  const signHandler = () => {
    navigate('/signup')
  }
  return (
    <>
      {alertErr?.status && (
        <Alert
          style={{zIndex:'1000'}}
          variant="danger"
          onClose={() => setAlertErr({ msg: "", status: false })}
          dismissible
        >
          <span style={{ margin: 0 }}>{alertErr?.msg}</span>
        </Alert>
      )}

      <h2 style={{ textAlign: "center", marginTop: "90px" }}>
        Use Login
      </h2>

      <div style={{ display: "flex", justifyContent: "center", marginTop: '30px' }}>
        <form autoComplete="off" style={{ width: "300px" }}>

          <FloatingLabel label="Phone Number" className="mb-3">
            <Form.Control
              type="text"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  setPhone(e.target.value);
                }
              }}
            />
            {error && (
              <Form.Text className="text-danger">
                {error}
              </Form.Text>
            )}
          </FloatingLabel>

          <Button
            variant="primary"
            style={{ width: "100%" }}
            onClick={formSubmitHandler}
            disabled={!phone}
          >
            Log In
          </Button>
        </form>
      </div>
      <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: '400', color: 'red', cursor: 'pointer' }} onClick={signHandler} >Come First Time Click to Signup</p>
    </>
  );
};

export default Login;