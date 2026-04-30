import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Container, Card, Badge, Spinner, ProgressBar } from "react-bootstrap";
import { HttpApi } from "./utils";

const socket = io("http://localhost:9000");

const DeliveryStatus = () => {
    const [order, setOrder] = useState(null);
    const getApiCall = async () => {
        await HttpApi.get("deliveryorder");
    }
    useEffect(() => {
        getApiCall()
        socket.on("orderStatus", (data) => {
            setOrder(data);
        });

        return () => {
            socket.off("orderStatus");
        };
    }, []);

    const getProgress = (status) => {
        switch (status) {
            case "Order Received":
                return 25;
            case "Preparing":
                return 50;
            case "Out for Delivery":
                return 75;
            case "Delivered":
                return 100;
            default:
                return 0;
        }
    };

    const getStatusMessage = (status) => {
        switch (status) {
            case "Order Received":
                return "📦 Order received by restaurant";
            case "Preparing":
                return "👨‍🍳 Your food is being prepared";
            case "Out for Delivery":
                return "🚚 Rider is on the way";
            case "Delivered":
                return "✅ Delivered successfully";
            default:
                return "Waiting for updates...";
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "420px" }} className="shadow-lg p-3">
                <Card.Body className="text-center">
                    <Card.Title className="mb-3">🍔 Order Tracking</Card.Title>

                    {!order && (
                        <div className="my-4">
                            <Spinner animation="border" />
                            <p className="mt-2 text-muted">Waiting for order updates...</p>
                        </div>
                    )}

                    {order && (
                        <>
                            <p>
                                <strong>Order ID:</strong> {order.id}
                            </p>

                            <h5 className="mb-3">
                                <Badge bg="dark">{order.status}</Badge>
                            </h5>

                            <ProgressBar
                                now={getProgress(order.status)}
                                label={`${getProgress(order.status)}%`}
                                className="mb-3"
                            />

                            <p className="fw-semibold">
                                {getStatusMessage(order.status)}
                            </p>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DeliveryStatus;