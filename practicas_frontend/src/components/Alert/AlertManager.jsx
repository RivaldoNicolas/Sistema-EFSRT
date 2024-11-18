import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeAlert } from "../../redux/slices/alertSlice";
import { Toast } from "react-bootstrap";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const AlertContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledToast = styled(Toast)`
  min-width: 300px;
  background: ${props => {
        switch (props.type) {
            case 'success': return 'linear-gradient(to right, #00b09b, #96c93d)';
            case 'error': return 'linear-gradient(to right, #ff5f6d, #ffc371)';
            case 'warning': return 'linear-gradient(to right, #f2994a, #f2c94c)';
            case 'info': return 'linear-gradient(to right, #2193b0, #6dd5ed)';
            default: return 'white';
        }
    }};
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  color: white;

  .toast-header {
    background: transparent;
    border: none;
    color: white;
  }

  .toast-body {
    padding: 12px 16px;
    font-weight: 500;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1em;
`;

const AlertManager = () => {
    const alerts = useSelector(state => state.alert.alerts);
    const dispatch = useDispatch();

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <FaCheckCircle size={20} />;
            case 'error': return <FaExclamationCircle size={20} />;
            case 'warning': return <FaExclamationTriangle size={20} />;
            case 'info': return <FaInfoCircle size={20} />;
            default: return null;
        }
    };

    useEffect(() => {
        alerts.forEach(alert => {
            setTimeout(() => {
                dispatch(removeAlert(alert.id));
            }, 5000);
        });
    }, [alerts, dispatch]);

    return (
        <AlertContainer>
            <AnimatePresence>
                {alerts.map(alert => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                    >
                        <StyledToast
                            type={alert.type}
                            onClose={() => dispatch(removeAlert(alert.id))}
                        >
                            <Toast.Header closeButton>
                                <IconWrapper>
                                    {getIcon(alert.type)}
                                    <strong>{alert.type.toUpperCase()}</strong>
                                </IconWrapper>
                            </Toast.Header>
                            <Toast.Body>{alert.message}</Toast.Body>
                        </StyledToast>
                    </motion.div>
                ))}
            </AnimatePresence>
        </AlertContainer>
    );
};

export default AlertManager;
