import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/hotelsStyle.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const HotelList = () => {
    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate();
    const fieldsHeader = ['Nombre', 'Cuartos', 'Dirección', 'NIT', 'Ciudad', 'Estado', 'Opciones'];
    const url = `https://hoteles-decameron-production.up.railway.app/api/hotels`;

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const response = await axios.get(`${url}/list`);
            setHotels(response.data.data);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/hotels/edit/${id}`);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "¿En verdad quiere eliminar el hotel?",
            showDenyButton: true,
            confirmButtonText: "Si",
            denyButtonText: `No`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${url}/destroy/${id}`);
                    Swal.fire(`${response.data.message}`, "", response.data.state == 200 ? "success" : "error");
                    if (response.data.state == 200) {
                        setTimeout(() => {
                            navigate('/hotels');
                        }, 800);
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
            <h2>Listado de Hoteles</h2>
            <button onClick={() => navigate('/hotels/create')} className="btn btn-primary mb-3">Crear Hotel</button>

            <div className="table-responsive mt-3">
                <div className="table-wrapper">
                    <table className="table table-dark table-striped-columns table-bordered custom-table">
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
                                        <td data-label="">{hotel.name}</td>
                                        <td data-label="">{hotel.rooms}</td>
                                        <td data-label="">{hotel.address}</td>
                                        <td data-label="">{hotel.nit}</td>
                                        <td data-label="">{hotel.city?.name || 'Sin ciudad'}</td>
                                        <td data-label="">{hotel.status ? 'Activo' : 'Inactivo'}</td>
                                        <td data-label="">
                                            <div className="d-flex gap-2 px-1">
                                                <button onClick={() => handleEdit(hotel.id)} className="btn btn-warning btn-sm">Editar</button>
                                                <button onClick={() => handleDelete(hotel.id)} className="btn btn-danger btn-sm">Eliminar</button>
                                                <button onClick={() => handleAssign(hotel.id)} className="btn btn-info btn-sm">Asignar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No hay hoteles registrados.</td>
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