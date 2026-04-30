import { useEffect, useState } from "react";
import { Table, Container } from "react-bootstrap";
import { HttpApi } from "./utils";

const History = () => {
  const username = localStorage.getItem("username"); 
  const [history, setHistory] = useState([]);

  const getAllHistory = async () => {
    try {
      const res = await HttpApi.get("fetchAllExpense");
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.log("Error fetching history:", err);
    }
  };

  useEffect(() => {
    getAllHistory();
  }, []);

  return (
    <Container style={{ marginTop: "90px" }}>
      <h3 className="mb-3">{username}'s Expense History</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Dish Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {history.length > 0 ? (
            history.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.dishName}</td>
                <td>₹{item.price}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price * item.quantity}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No history found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default History;