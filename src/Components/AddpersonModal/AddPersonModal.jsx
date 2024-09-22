import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    Button,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage
} from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from 'react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createPerson } from '../../Service/PersonService';
import { toast, ToastContainer } from 'react-toastify';

// Validation schema for Formik
const personValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").max(256, "Name cannot exceed 256 characters"),
    surname: Yup.string().required("Surname is required").max(256, "Surname cannot exceed 256 characters"),
    fatherName: Yup.string().required("Father's name is required").max(256, "Father's name cannot exceed 256 characters"),
    organisation: Yup.string().max(500, "Organisation cannot exceed 500 characters"),
    phoneNumber: Yup.string().required("Phone number is required").max(20, "Phone number cannot exceed 20 characters"),
    role: Yup.string().required("Role is required").max(100, "Role cannot exceed 100 characters"),
    roomNumber: Yup.string().max(50, "Room number cannot exceed 50 characters"),
    email: Yup.string().email("Invalid email format").required("Email is required").max(256, "Email cannot exceed 256 characters"),
    age: Yup.number().required("Age is required").min(16, "Age must be at least 16").max(100, "Age cannot exceed 100"),
    specialNote: Yup.string().max(5000, "Special note cannot exceed 5000 characters"),
    image: Yup.mixed().required("An image is required"), // Ensure image is required
});
const CustomField = ({ name, placeholder }) => {
    const { errors, touched } = useFormikContext();
    return (
        <FormControl isInvalid={!!errors[name] && touched[name]}>
            <FormLabel>{placeholder}</FormLabel>
            <Field name={name} placeholder={placeholder} as={Input} />
            <ErrorMessage name={name} component={FormErrorMessage} />
        </FormControl>
    );
};

export default function AddPersonModal({ isOpen, onClose, filteredPersons, setFilteredPersons }) {
    const queryClient = useQueryClient()
    const addPersonMutation = useMutation(createPerson, {
        onSuccess: (newPerson) => {
            queryClient.invalidateQueries('persons')
            setFilteredPersons((prev) => [...prev, newPerson]);
            toast({
                title: "Success",
                description: "Created successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        },
        onError: (error) => {
            console.error("Error adding person:", error);
            toast({
                title: "Error",
                description: "An error occurred while creating the person.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            onClose();
        }
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ToastContainer />

            <ModalContent>
                <ModalHeader>Add New Person</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Formik
                        initialValues={{
                            name: "",
                            surname: "",
                            fatherName: "",
                            organisation: "",
                            phoneNumber: "",
                            role: "",
                            roomNumber: "",
                            email: "",
                            age: "",
                            specialNote: "",
                            image: null,
                        }}
                        validationSchema={personValidationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            addPersonMutation.mutate({
                                data: values, // Pass values as data
                                file: values.image, // Pass the file
                            });
                            setSubmitting(false);
                        }}
                    >
                        {({ isSubmitting, setFieldValue }) => (
                            <Form>
                                <CustomField name="name" placeholder="Name" />
                                <CustomField name="surname" placeholder="Surname" />
                                <CustomField name="fatherName" placeholder="Father's Name" />
                                <CustomField name="organisation" placeholder="Organisation" />
                                <CustomField name="phoneNumber" placeholder="Phone Number" />
                                <CustomField name="role" placeholder="Role" />
                                <CustomField name="roomNumber" placeholder="Room Number" />
                                <CustomField name="email" placeholder="Email" type="email" />
                                <CustomField name="age" placeholder="Age" type="number" />

                                <FormControl mt={4}>
                                    <FormLabel>Upload Image</FormLabel>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            setFieldValue("image", file);
                                        }}
                                    />
                                    <ErrorMessage name="image" component={FormErrorMessage} />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Special Note</FormLabel>
                                    {/* Using Formik Field to bind ReactQuill */}
                                    <Field name="specialNote">
                                        {({ field, form }) => (
                                            <ReactQuill
                                                value={field.value} // Bind the current value from Formik
                                                onChange={value => form.setFieldValue(field.name, value)} // Update Formik state when editing
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="specialNote" component={FormErrorMessage} />
                                </FormControl>


                                <ModalFooter>
                                    <Button colorScheme="blue" mr={3} type="submit" isLoading={isSubmitting}>
                                        Save
                                    </Button>
                                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                                </ModalFooter>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
