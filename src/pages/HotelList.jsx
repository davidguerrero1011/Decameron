import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/hotelsStyle.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const HotelList = () => {
    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate();
    const fieldsHeader = ['Nombre', 'NIT', 'Dirección', 'Ciudad', 'Cuartos', 'Correo', 'Telefono', 'Opciones'];

    // const url = `http://127.0.0.1:8000/api/hotels`;
    const url = `http://3.148.167.245/api/hotels`;

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const response = await axios.get(`${url}/list`);
            console.log(response);
            setHotels(response.data[0]);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/hotels/edit/${id}`);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "¿En verdad quieres eliminar el hotel?",
            showDenyButton: true,
            confirmButtonText: "Si",
            denyButtonText: `No`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${url}/destroy/${id}`);
                    console.log(response);
                    
                    Swal.fire(`${response.data.message}`, "", response.status == 200 ? "success" : "error");
                    if (response.status == 200) {
                        fetchHotels();
                    }
                } catch (error) {
                    console.log(error);
                }
            } else if (result.isDenied) {
                Swal.fire("Cambios no guardados", "", "info");
            }
        });
    };

    const handleAssign = (id) => {
        navigate(`/hotels/assign/${id}`);
    };

    return (
        <div className="container mt-4">
            <h2>Hoteles Decameron</h2>
            <button onClick={() => navigate('/hotels/create')} className="btn btn-light mb-3">Crear Hotel</button>

            <div className="table-responsive mt-3">
                <div className="table-wrapper">
                    <table className="table custom-table">
                        <thead className="table-light text-dark">
                            <tr>
                                {fieldsHeader.map((field, index) => (
                                    <th key={index}>{field}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {hotels.length > 0 ? (
                                hotels.map((hotel) => (
                                    <tr key={hotel.id}>
                                        <td data-label="Nombre"><span>{hotel.name}</span></td>
                                        <td data-label="NIT"><span>{hotel.nit}</span></td>
                                        <td data-label="Dirección"><span>{hotel.address}</span></td>
                                        <td data-label="Ciudad"><span>{hotel.city?.name || 'Sin ciudad'}</span></td>
                                        <td data-label="Cuartos"><span>{hotel.rooms_capacity}</span></td>
                                        <td className='email-text' data-label="Correo"><span>{hotel.email}</span></td>
                                        <td data-label="Telefono"><span>{hotel.phone}</span></td>
                                        <td data-label="Opciones">
                                            <div className="d-flex gap-2 px-1">
                                                <button onClick={() => handleEdit(hotel.id)} className="btn btn-warning btn-sm">Editar</button>
                                                <button onClick={() => handleDelete(hotel.id)} className="btn btn-danger btn-sm">Eliminar</button>
                                                <button onClick={() => handleAssign(hotel.id)} className="btn btn-info btn-sm">Asignar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className='no-data-row'>
                                    <td className='text-center' colSpan={fieldsHeader.length}>No hay hoteles registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HotelList;