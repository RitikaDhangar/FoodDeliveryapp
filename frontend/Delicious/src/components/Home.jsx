import { useEffect, useState } from "react";
import { HttpApi } from "./utils";
import { Card, Button, Row, Col, Form, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import DeliveryStatus from "./DeliveryStatus";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [page, setPage] = useState(1);
    const [dishes, setDishes] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");
    const [delivery,setDelivery]=useState(false);
    const navigate=useNavigate();
    const getallDishesHandler = async () => {
        try {
            const res = await HttpApi.post(`/alldishes`, {
                page: page,
                limit: 9,
            });

            if (res.data.success) {
                setDishes(res.data.data);
            }
        } catch (err) {
            console.log(err);
        }
    };


    const filteredDishes = dishes.filter((dish) =>
        dish.name.toLowerCase().includes(search.toLowerCase())
    );

    const addToCart = (dish) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === dish.id);

            if (existing) {
                return prev.map((item) =>
                    item.id === dish.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prev, { ...dish, quantity: 1 }];
            }
        });
    };

    const increaseQty = (id) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQty = (id) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const getCartItem = (id) => {
        return cart.find((item) => item.id === id);
    };

    const paymentHandler = async () => {
        try {
            const totalAmount = cart.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            const res = await HttpApi.post("createOrder", {
                amount: totalAmount * 100,
            });

            if (res?.data?.success) {
                const data = res.data;

                const options = {
                    key: data?.key_id,
                    order_id: data?.data?.id,
                    amount: data?.data?.amount,
                    currency: "INR",
                    name: "Delicious",
                    description: "Order Payment",

                    handler: async function (response) {
                        const cartItems = cart.map((item) => {
                            return {
                                dishName: item.name,
                                price: item.price,
                                quantity: item.quantity,
                            }
                        })
                        const verifyRes = await HttpApi.post(
                            "verifyPayment",
                            {
                                razorpay_order_id:
                                    response?.razorpay_order_id,
                                razorpay_payment_id:
                                    response?.razorpay_payment_id,
                                razorpay_signature:
                                    response?.razorpay_signature,
                                amount: totalAmount,
                                cartItems:cartItems
                            }
                        );

                        if (verifyRes?.data?.success) {
                            setCart([]);
                            setDelivery(true);
                            navigate('/delivery')
                            toast.success("Payment Successful");
                            
                        } else {
                            toast.error("Payment verification failed");
                        }
                    },

                    theme: {
                        color: "#28a745",
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            }
        } catch (err) {
            console.log(err);
            toast.error("Payment failed");
        }
    };

    useEffect(() => {
        getallDishesHandler();
    }, [page]);

    return (
        <>
        <Container
            style={{ marginTop: "80px", paddingBottom: "120px" }}
        >
            <h2 className="mb-3">🍽️ Food Menu</h2>

            <Form className="mb-4">
                <Form.Control
                    type="text"
                    placeholder="Search dishes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Form>

            <Row>
                {filteredDishes.map((dish) => {
                    const cartItem = getCartItem(dish.id);

                    return (
                        <Col md={4} key={dish.id} className="mb-4">
                            <Card style={{ height: "100%" }}>
                                <Card.Img
                                    variant="top"
                                    src={dish.image}
                                    style={{
                                        height: "200px",
                                        objectFit: "cover",
                                    }}
                                />

                                <Card.Body>
                                    <Card.Title>{dish.name}</Card.Title>

                                    <Card.Text style={{ fontSize: "14px" }}>
                                        {dish.description.slice(0, 60)}...
                                    </Card.Text>

                                    <h5>₹{dish.price}</h5>

                                    {cartItem ? (
                                        <div className="d-flex align-items-center gap-2">
                                            <Button
                                                variant="danger"
                                                onClick={() =>
                                                    decreaseQty(dish.id)
                                                }
                                            >
                                                -
                                            </Button>

                                            <span>{cartItem.quantity}</span>

                                            <Button
                                                variant="success"
                                                onClick={() =>
                                                    increaseQty(dish.id)
                                                }
                                            >
                                                +
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            onClick={() => addToCart(dish)}
                                        >
                                            Add to Cart
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <div className="d-flex justify-content-center gap-3 mt-4">
                <Button
                    variant="secondary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </Button>

                <span className="mt-2">Page {page}</span>

                <Button
                    variant="secondary"
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </Button>
            </div>

            <div
                style={{
                    position: "fixed",
                    bottom: "45px",
                    left: "0",
                    width: "100%",
                    background: "#fff",
                    padding: "10px 20px",
                    boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 1000,
                }}
            >
                <div>
                    <strong>Total Items:</strong>{" "}
                    {cart.reduce(
                        (total, item) => total + item.quantity,
                        0
                    )}
                </div>

                <div>
                    <strong>
                        ₹
                        {cart.reduce(
                            (total, item) =>
                                total + item.price * item.quantity,
                            0
                        )}
                    </strong>
                </div>

                <Button
                    variant="success"
                    disabled={cart.length === 0}
                    onClick={paymentHandler}
                >
                    Proceed to Pay
                </Button>
            </div>
        </Container>
        {
        delivery && DeliveryStatus
        }
        </>
    );
};

export default Home;