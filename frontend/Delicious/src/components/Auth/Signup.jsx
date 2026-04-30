import { useState } from "react";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import axios from "axios";
import toast from "react-hot-toast";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [inputControl, setInputControl] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [focused, setFocused] = useState({
    name: false,
    phone: false,
    address: false,
  });

  const [inputErr, setInputErr] = useState({
    name: true,
    phone: true,
    address: true,
  });

  const [InValidForm, setInValidForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [alertErr, setAlertErr] = useState({ status: false, msg: "" });


  const formSubmitHandler = async () => {
    setInputErr({
      name: Boolean(inputControl?.name?.length),
      phone: Boolean(inputControl?.phone?.length),
      address: Boolean(inputControl?.address?.length),
    });

    const isError = checkValidationForms();
    if (isError) return;

    const { name, phone, address } = inputControl;

    const res = await axios.post(`http://localhost:9000/createUser`, {
      name,
      phone,
      address,
    });

    if (res.data.success) {
      toast.success("User Created successfully");
      navigate("/");
      localStorage.setItem('token',res.data.data.token);
      localStorage.setItem('username',name);
    } else {
      setAlertErr({ status: true, msg: res?.data?.message });
    }
  };

  const checkValidationForms = () => {
    let isError = false;

    if (inputControl?.name?.length < 3) {
      isError = true;
      setInValidForm((prev) => ({ ...prev, name: "Username is not valid" }));
    } else {
      setInValidForm((prev) => ({ ...prev, name: "" }));
    }

    if (inputControl?.phone?.length !== 10) {
      isError = true;
      setInValidForm((prev) => ({ ...prev, phone: "Phone must be 10 digits" }));
    } else {
      setInValidForm((prev) => ({ ...prev, phone: "" }));
    }

    if (inputControl?.address?.length < 5) {
      isError = true;
      setInValidForm((prev) => ({ ...prev, address: "Address is too short" }));
    } else {
      setInValidForm((prev) => ({ ...prev, address: "" }));
    }

    return isError;
  };
  const loginHandler = () => {
    navigate('/login')
  }
  return (
    <>
      {alertErr?.status && (
        <Alert
          variant="danger"
          dismissible
          style={{zIndex:'1000'}}
          onClose={() => setAlertErr({ msg: "", status: false })}
        >
          <span style={{ margin: 0 }}>{alertErr?.msg}</span>
        </Alert>
      )}

      <h2 style={{ textAlign: "center", marginTop: "90px" }}>
        User Signup
      </h2>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <form autoComplete="off" style={{ width: "300px" }}>

          <FloatingLabel label="Name" className="mb-2">
            <Form.Control
              type="text"
              placeholder="Name"
              value={inputControl.name}
              onChange={(e) => {
                setInputControl({ ...inputControl, name: e.target.value });
                setInputErr({ ...inputErr, name: Boolean(e.target.value) });
              }}
            />
            {InValidForm.name && (
              <Form.Text className="text-danger">
                {InValidForm.name}
              </Form.Text>
            )}
          </FloatingLabel>

          <FloatingLabel label="Phone" className="mb-2">
            <Form.Control
              type="text"
              placeholder="Phone"
              value={inputControl.phone}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  setInputControl({ ...inputControl, phone: e.target.value });
                  setInputErr({ ...inputErr, phone: Boolean(e.target.value) });
                }
              }}
            />
            {InValidForm.phone && (
              <Form.Text className="text-danger">
                {InValidForm.phone}
              </Form.Text>
            )}
          </FloatingLabel>

          <FloatingLabel label="Address" className="mb-2">
            <Form.Control
              as="textarea"
              placeholder="Address"
              style={{ height: "100px" }}
              value={inputControl.address}
              onChange={(e) => {
                setInputControl({ ...inputControl, address: e.target.value });
                setInputErr({ ...inputErr, address: Boolean(e.target.value) });
              }}
            />
            {InValidForm.address && (
              <Form.Text className="text-danger">
                {InValidForm.address}
              </Form.Text>
            )}
          </FloatingLabel>

          <Button
            variant="primary"
            style={{ width: "100%", cursor: 'pointer' }}
            onClick={formSubmitHandler}
            disabled={
              !(
                inputControl.name &&
                inputControl.phone &&
                inputControl.address
              )
            }
          >
            Sign Up
          </Button>
        </form>
      </div>
      <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: '400', color: 'red', cursor: 'pointer' }} onClick={loginHandler} >If already Signup Click to Login</p>
    </>
  );
};

export default Signup;