import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Flex, Button, useToast, Input } from '@chakra-ui/react';
import { httpClient } from '../../Utils/HttpClient';
import Styles from './PersonDetailModal.module.css';
import ConfirmationModal from '../ConfirmationModal';
import { useQueryClient } from 'react-query';
import { editPerson } from '../../Service/PersonService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify'; // Import DOMPurify
import { faL } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import fallbackImageImport from '../../Images/Placehoder/elementor-placeholder-image.webp'
import { ROLE_ADMIN } from '../../Helper/constants';
import jwtDecode from 'jwt-decode';
function PersonDetailModal({ isOpen, onClose, person }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [initialImageSrc, setInitialImageSrc] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPerson, setEditedPerson] = useState(person);
    const [file, setFile] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]);
    const fallbackImage = fallbackImageImport;
    const toast = useToast();
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);
    const queryClient = useQueryClient();
    const { token } = useSelector((x) => x.auth);
    let decodedToken = null;
    let Role = null;
    if (token) {
        try {
            decodedToken = jwtDecode(token); // Decode the JWT
            Role = decodedToken.Role; // Log the decoded token
        } catch (error) {
            console.error("Token decoding failed:", error);
        }
    } else {
        console.log("No token found.");
    }

    useEffect(() => {
        if (person) {
            setEditedPerson(person);
            const fetchImage = async () => {
                try {
                    const response = await httpClient.get(`/api/Person/${person.id}`, { responseType: 'blob' });
                    const url = URL.createObjectURL(new Blob([response.data]));
                    setImageSrc(url);
                    setInitialImageSrc(url);
                } catch (error) {
                    console.error("Error fetching image", error);
                    setImageSrc(fallbackImage);
                    setInitialImageSrc(fallbackImage);
                }
            };
            fetchImage();
        } else {
            setImageSrc(fallbackImage);
            setInitialImageSrc(fallbackImage);
        }
    }, [person]);

    const handleDelete = async () => {
        try {
            await httpClient.delete(`/api/Person/Delete?Id=${person.id}`, {
                headers: { Authorization: `Bearer ${token}` } 
            });
            toast({
                title: "Person deleted.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            queryClient.invalidateQueries('persons');
            setConfirmationOpen(false);
            onClose();
        } catch (error) {
            console.error("Error deleting person", error);
            toast({
                title: "Error deleting person.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };
    const handleSaveChanges = async () => {
        setErrorMessages([]);
        try {
            // Use the initial image source if no new file is selected
            const imageToUpload = file ? file : initialImageSrc;

            await editPerson(person.id, editedPerson, imageToUpload, token);
            toast({
                title: "Person updated.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            queryClient.invalidateQueries('persons');
            setIsEditing(false);
            onClose()
        } catch (error) {
            console.error("Error updating person", error);
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
                const messages = [];
                for (const field in errors) {
                    messages.push(...errors[field]);
                }
                setErrorMessages(messages);
            } else {
                toast({
                    title: "Error updating person.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    useEffect(() => {
        setIsEditing(false)
    }, [isOpen])
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent width={'max-content'}>
                    <ModalHeader>{person?.name} {person?.surname}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex>
                            <div>
                                {!isEditing &&
                                    <img
                                        className={Styles.Image}
                                        src={imageSrc || initialImageSrc}
                                        alt={`${person?.name} ${person?.surname}`}
                                        style={{ maxWidth: '150px', maxHeight: '150px', marginRight: '20px' }}
                                        onError={(e) => { e.target.src = fallbackImage; }}
                                    />
                                }
                            </div>
                            <div>
                                {isEditing ? (
                                    <>
                                        <div>
                                            <label>Image:</label>
                                            <img
                                                src={imageSrc || initialImageSrc}
                                                alt={`${person?.name} ${person?.surname}`}
                                                style={{ maxWidth: '150px', maxHeight: '150px', marginBottom: '10px' }}
                                                onError={(e) => { e.target.src = fallbackImage; }}
                                            />
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const selectedFile = e.target.files[0];
                                                    if (selectedFile) {
                                                        setFile(selectedFile);
                                                        const url = URL.createObjectURL(selectedFile);
                                                        setImageSrc(url);
                                                    }
                                                }}
                                                placeholder="Add Image"
                                                marginBottom="20px"
                                            />
                                        </div>

                                        <label>Name:</label>
                                        <Input
                                            placeholder="Name"
                                            value={editedPerson?.name}
                                            onChange={(e) => setEditedPerson({ ...editedPerson, name: e.target.value })}
                                        />
                                        <label>Surname:</label>
                                        <Input
                                            placeholder="Surname"
                                            value={editedPerson?.surname}
                                            onChange={(e) => setEditedPerson({ ...editedPerson, surname: e.target.value })}
                                        />
                                        <label>Father's Name:</label>
                                        <Input
                                            placeholder="Father's Name"
                                            value={editedPerson?.fatherName}
                                            onChange={(e) => setEditedPerson({ ...editedPerson, fatherName: e.target.value })}
                                        />
                                        <label>Email:</label>
                                        <Input
                                            placeholder="Email"
                                            value={editedPerson?.email}
                                            onChange={(e) => setEditedPerson({ ...editedPerson, email: e.target.value })}
                                        />
                                        <label>Phone Number:</label>
                                        <Input
                                            placeholder="Phone Number"
                                            value={editedPerson?.phoneNumber}
                                            onChange={(e) => setEditedPerson({ ...editedPerson, phoneNumber: e.target.value })}
                                        />
                                        <label>Organization:</label>
                                        <Input
                                            placeholder="Organization"
                                            value={editedPerson?.organisation}
                                            onChange={(e) => setEditedPerson({ ...editedPerson, organisation: e.target.value })}
                                        />
                                        <label>Room Number:</label>
                                        <Input
                                            placeholder="Room Number"
                                            value={editedPerson?.roomNumber}
                                            onChange={(e) => setEditedPerson({ ...editedPerson, roomNumber: e.target.value })}
                                        />
                                        <label>Role:</label>
                                        <Input
                                            placeholder="Role"
                                            value={editedPerson?.role}
                                            onChange={(e) => setEditedPerson({ ...editedPerson, role: e.target.value })}
                                        />
                                        <label>Special Note:</label>
                                        <ReactQuill
                                            value={editedPerson?.specialNote}
                                            onChange={(value) => setEditedPerson({ ...editedPerson, specialNote: value })}
                                            placeholder="Enter special note"
                                        />
                                        <label>Age:</label>
                                        <Input
                                            placeholder="Age"
                                            value={editedPerson?.age}
                                            onChange={(e) => setEditedPerson({ ...editedPerson, age: e.target.value })}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <p><strong style={{ fontWeight: "700" }}>Father's Name:</strong> {person?.fatherName}</p>
                                        <p><strong style={{ fontWeight: "700" }}>Email:</strong> {person?.email}</p>
                                        <p><strong style={{ fontWeight: "700" }}>Phone Number:</strong> {person?.phoneNumber}</p>
                                        <p><strong style={{ fontWeight: "700" }}>Organization:</strong> {person?.organisation}</p>
                                        <p><strong style={{ fontWeight: "700" }}>Room Number:</strong> {person?.roomNumber}</p>
                                        <p><strong style={{ fontWeight: "700" }}>Role:</strong> {person?.role}</p>
                                        <p><strong style={{ fontWeight: "700" }}>Special Note:</strong></p>
                                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(person?.specialNote) }} />
                                        <p><strong style={{ fontWeight: "700" }}>Age:</strong> {person?.age}</p>
                                        <p><strong style={{ fontWeight: "700" }}>Created At:</strong> {new Date(person?.createtime).toLocaleString()}</p>
                                        <p><strong style={{ fontWeight: "700" }}>Modified At:</strong> {new Date(person?.modifiedDate).toLocaleString()}</p>
                                    </>
                                )}
                            </div>
                        </Flex>
                        {errorMessages.length > 0 && (
                            <div style={{ color: 'red', marginTop: '10px' }}>
                                {errorMessages.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        )}

                        <Flex justifyContent="end" gap={2} marginTop="20px">
                            {isEditing ? (
                                <>
                                    <Button className={Styles.Button3} colorScheme="green" onClick={handleSaveChanges}>
                                        Save Changes
                                    </Button>
                                    <Button className={Styles.Button3} onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Flex gap={2}>
                                    {Role === ROLE_ADMIN &&
                                        <>
                                            <Button className={Styles.Button3} colorScheme="blue" onClick={() => setIsEditing(true)}>
                                                Edit
                                            </Button>
                                            <Button className={Styles.Button3} colorScheme="red" onClick={() => setConfirmationOpen(true)}>
                                                Delete
                                            </Button>
                                        </>
                                    }
                                </Flex>
                            )}
                        </Flex>
                        <ConfirmationModal
                            isOpen={isConfirmationOpen}
                            onClose={() => setConfirmationOpen(false)}
                            onConfirm={handleDelete}
                            message={`Are you sure you want to delete ${person?.name} ${person?.surname}?`}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default PersonDetailModal;
