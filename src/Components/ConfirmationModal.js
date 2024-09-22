import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Flex, Button } from '@chakra-ui/react';
import Styles from './PersonDetailModal/PersonDetailModal.module.css'
function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm Deletion</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" alignItems="center">
                        <p>{message}</p>
                        <Flex gap={4} marginTop="20px">
                            <Button className={Styles.Button2} colorScheme="red" onClick={onConfirm}>Delete</Button>
                            <Button className={Styles.Button3} marginLeft="10px" onClick={onClose}>Cancel</Button>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default ConfirmationModal;
