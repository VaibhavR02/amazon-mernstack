import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './PaytmModal.css'; // Add this CSS file to style the modal

const PaytmModal = ({
  showPaytmModal,
  closeModal,
  confirmPaytmPayment,
  order,
}) => {
  return (
    <Modal show={showPaytmModal} onHide={closeModal} centered>
      <Modal.Header closeButton className="paytm-modal-header">
        <Modal.Title>
          <img
            src="path_to_paytm_logo.png" // Replace with Paytm logo or any relevant logo for a similar look
            alt="Paytm"
            className="paytm-logo"
          />
          Pay with Paytm
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="paytm-info">
          This is a demo Paytm payment experience for testing purposes.
        </p>
        <p className="paytm-order-total">
          <strong>Order Total:</strong> ₹{order.totalPrice}
        </p>
        <p className="paytm-instruction">
          Please proceed to payment through Paytm.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={closeModal}
          className="paytm-button"
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={confirmPaytmPayment}
          className="paytm-button paytm-confirm-button"
        >
          Confirm Payment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaytmModal;
