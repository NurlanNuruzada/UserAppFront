import { httpClient } from "../Utils/HttpClient";

// Create a new person
export const createPerson = async ({ data, file }) => { // Use destructuring
    const formData = new FormData();

    // Append each field directly to FormData
    formData.append("RoomNumber", data.roomNumber);
    formData.append("FatherName", data.fatherName);
    formData.append("SpecialNote", data.specialNote);
    formData.append("Name", data.name);
    formData.append("Role", data.role);
    formData.append("PhoneNumber", data.phoneNumber);
    formData.append("Organisation", data.organisation);
    formData.append("Surname", data.surname);
    formData.append("Email", data.email);
    formData.append("Age", data.age);

    // Append the file if it exists
    if (file) {
        formData.append("file", file); // Ensure the key matches the backend expectation
    }
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    return await httpClient.post('/api/Person/Create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


// Edit an existing person
export const editPerson = async (id, data, file) => {
    const formData = new FormData();
    
    // Append each field directly to FormData
    formData.append("id", id);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("surname", data.surname);
    formData.append("fatherName", data.fatherName);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("organisation", data.organisation);
    formData.append("roomNumber", data.roomNumber);
    formData.append("role", data.role);
    formData.append("specialNote", data.specialNote);
    formData.append("age", data.age);
    if (file) {
        formData.append("file", file);
    }
    return await httpClient.put(`/api/Person/Edit`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


// Get all users with pagination
// PersonService.js
export const getAllUsers = async (currentPage, pageSize, searchQuery) => {
    try {
        const response = await httpClient.get(`/api/Person/Get?pageNumber=${currentPage}&pageSize=${pageSize}&searchQuery=${searchQuery}`);
        return response.data; // If you're using axios, the data is inside response.data
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; // Handle the error properly
    }
};


// Remove a person
export const removePerson = async (id) => {
    return await httpClient.delete(`/api/persons/remove/${id}`);
};