import React, { useState } from 'react';
import { Input, Button, Select, useDisclosure, Flex } from '@chakra-ui/react';
import Styles from './Homepage.module.css';
import AddPersonModal from '../../Components/AddpersonModal/AddPersonModal';
import PersonDetailModal from '../../Components/PersonDetailModal/PersonDetailModal';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAllUsers, createPerson } from '../../Service/PersonService';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../../Redux/Slices/AuthSlice';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { ROLE_ADMIN } from '../../Helper/constants';
import { useNavigate } from 'react-router';

export default function Homepage() {
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [searchInput, setSearchInput] = useState(""); // For input field value
    const [searchQuery, setSearchQuery] = useState(""); // For search query to trigger the request
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const dispatch = useDispatch();
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

    const { data, isLoading } = useQuery(['persons', currentPage, pageSize, searchQuery],
        () => getAllUsers(currentPage, pageSize, searchQuery, token), {
        keepPreviousData: true // Avoids empty content when switching pages
    });

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value); // Update search input field
    };

    const handleSearchClick = () => {
        setSearchQuery(searchInput); // Apply the search query and trigger the request
        setCurrentPage(1); // Reset to the first page
        queryClient.invalidateQueries('persons'); // Re-fetch persons with new search query
    };

    const openDetailModal = (person) => {
        setSelectedPerson(person);
        onDetailOpen();
    };

    const addPersonMutation = useMutation(createPerson, {
        onSuccess: () => {
            queryClient.invalidateQueries('persons');
            onAddClose();
        },
        onError: (error) => {
            console.error("Error adding person:", error);
        }
    });

    const handleNextPage = () => {
        if (data && currentPage < data.maxPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };
    const navigate = useNavigate()
    return (
        <div className={Styles.Main}>
            <div className={Styles.Controls}>
                <Flex gap={5}>
                    <Input
                        placeholder="Search by name or surname..."
                        value={searchInput} // Controlled input for search
                        onChange={handleSearchChange} // Update searchInput state on change
                        width="250px"
                        height={'30px'}
                        padding={"10px 0px"}
                        border={"1px solid #0095ff"}
                        paddingLeft={'10px'}
                        mb={4}
                    />
                    <Button className={Styles.Button} onClick={handleSearchClick} colorScheme="blue" ml={2}>
                        Search
                    </Button>
                </Flex>
                <Flex gap={2}>
                    {Role === ROLE_ADMIN &&
                        <>
                            <Button className={Styles.Button} onClick={onAddOpen} ml={4}>
                                Add Person
                            </Button>
                        </>
                    }
                    <Button className={Styles.Button4} onClick={() => dispatch(logoutAction())} ml={4}>
                        Log out
                    </Button>
                </Flex>
            </div>

            <Flex gap={2} alignItems={'center'}>
                <Flex gap={2} alignItems={'center'}>
                    <Button 
                    className={currentPage === 1 ? Styles.Button3 : Styles.Button}
                    onClick={handlePrevPage} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <span style={{ color: 'rgb(0 86 146)' }}>Page {currentPage}</span>
                    <Button _disabled={true} className={currentPage === data?.maxPages ? Styles.Button3 : Styles.Button} onClick={handleNextPage} disabled={currentPage === data?.maxPages}>
                        Next
                    </Button>
                </Flex>
                <Select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1); // Reset to the first page when changing page size
                    }}
                    width="auto"
                    height={'30px'}
                    padding={"10px 0px"}
                    border={"1px solid #0095ff"}
                >
                    <option value={20}>20</option>
                    <option value={25}>25</option>
                    <option value={35}>35</option>
                    <option value={45}>45</option>
                </Select>
            </Flex>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <table className={Styles.Table}>
                    <thead>
                        <tr>
                            <th><b>No </b></th>
                            <th><b>Name</b></th>
                            <th><b>Surname</b></th>
                            <th><b>Father Name</b></th>
                            <th><b>Organization</b></th>
                            <th><b>Phone Number</b></th>
                            <th><b>Role</b></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.users?.map((person, index) => (
                            <tr key={person.id} onClick={() => openDetailModal(person)}>
                                <td>{index + 1}</td>
                                <td>{person.name}</td>
                                <td>{person.surname}</td>
                                <td>{person.fatherName}</td>
                                <td>{person.organisation}</td>
                                <td>{person.phoneNumber}</td>
                                <td>{person.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <AddPersonModal
                isOpen={isAddOpen}
                onClose={onAddClose}
                addPersonMutation={addPersonMutation}
            />

            <PersonDetailModal
                isOpen={isDetailOpen}
                onClose={onDetailClose}
                person={selectedPerson}
            />
        </div>
    );
}
