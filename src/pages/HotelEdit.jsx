import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import '../css/editStyle.css';

const HotelEdit = () => {
    const [cities, setCities] = useState([]);
    const [hotel, setHotel] = useState({
        name: "",
        address: "",
        city_id: 0,
        nit: "",
        rooms: 0,
        status: null
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const url = `https://surprising-quietude.up.railway.app/api/hotels`;

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await axios.get(`${url}/show/${id}`);
                const data = response.data.data;

                setSuccessMessage('');
                setErrorMessage('');
                setValidationErrors([]);

                setHotel({
                    name: data.name || "",
                    address: data.address || "",
                    city_id: data.city_id || 0,
                    nit: data.nit || "",
                    rooms: data.rooms || 0,
                    status: data.status
                });

            } catch (error) {
                console.error("Error cargando hotel:", error);

                setSuccessMessage('');
                setValidationErrors([]);
                setErrorMessage('');

                if (error.response && error.response.status === 422) {
                    const allErrors = error.response.data.errors;
                    const messages = [];

                    for (let field in allErrors) {
                        messages.push(...allErrors[field]);
                    }

                    setValidationErrors(messages);
                } else if (error.response && error.response.data && error.response.data.message) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage('Ocurrió algún inconveniente a la hora de crear el hotel.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
        fetchCities();
    }, [id]);

    const handleChange = (e) => {
        setHotel({ ...hotel, [e.target.name]: e.target.value });
    };

    const fetchCities = async () => {
        let countryId = 1;
        try {
            const response = await axios.get(`${url}/cities/${countryId}`);
            setCities(response.data.data);
        } catch (error) {
            console.error('Error al obtener ciudades:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await axios.put(`${url}/update/${id}`, hotel);
            Swal.fire({
                title: `${response.data.message}`,
                icon: response.data.state == 200 ? "success" : "error",
                draggable: true
            });

            if (response.data.state == 200) {

                setSuccessMessage(response.data.message || "Hotel actualizado correctamente");
                setErrorMessage('');
                setValidationErrors([]);

                setTimeout(() => {
                    setSuccessMessage('');
                }, 300);

                setTimeout(() => {
                    navigate('/hotels');
                }, 800);
            }

        } catch (error) {
            console.error("Error actualizando hotel:", error);

            setSuccessMessage('');
            setValidationErrors([]);
            setErrorMessage('');

            if (error.response && error.response.status === 422) {
                const allErrors = error.response.data.errors;
                const messages = [];

                for (let field in allErrors) {
                    messages.push(...allErrors[field]);
                }

                setValidationErrors(messages);
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Ocurrió un error inesperado al actualizar el hotel.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (loading) return <p>Cargando datos del hotel...</p>;

    return (
        <>
            <style>{`
                .form-container {
                    max-width: 900px;
                    margin: 1rem auto;
                    padding: 1.5rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    background: #fff;
                }

                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                label {
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }

                input,
                select {
                    width: 100%;
                    padding: 0.5rem;
                    font-size: 1rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }

                button {
                    margin-top: 1rem;
                    width: 100%;
                    padding: 0.75rem;
                    font-size: 1rem;
                    border: none;
                    border-radius: 4px;
                    background-color: #007bff;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                button:disabled {
                    background-color: #aaa;
                    cursor: not-allowed;
                }

                button:hover:not(:disabled) {
                    background-color: #0056b3;
                }

                @media (max-width: 768px) {
                    .grid-container {
                    grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <form className="form-container" onSubmit={handleSubmit}>
                <h2>Editar Hotel</h2>

                {successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}

                {validationErrors.length > 0 && (
                    <div className="alert alert-danger" role="alert">
                        <ul className="mb-0">
                            {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="grid-container">
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={hotel.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Dirección</label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={hotel.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city_id">Ciudad</label>
                        <select
                            id="city_id"
                            name="city_id"
                            value={hotel.city_id}
                            onChange={handleChange}
                            required>
                            <option value="">Seleccione una ciudad</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="nit">NIT</label>
                        <input
                            id="nit"
                            name="nit"
                            type="text"
                            value={hotel.nit}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rooms">Habitaciones</label>
                        <input
                            id="rooms"
                            name="rooms"
                            type="number"
                            value={hotel.rooms}
                            onChange={(e) =>
                                setHotel({ ...hotel, rooms: parseInt(e.target.value) || 0 })
                            }
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label htmlFor="status">Hotel activo</label>
                        <input
                            id="status"
                            name="status"
                            type="checkbox"
                            checked={hotel.status}
                            onChange={(e) =>
                                setHotel({ ...hotel, status: e.target.checked })
                            }
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" disabled={saving}>
                        {saving ? "Guardando..." : "Actualizar Hotel"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                            backgroundColor: "#6c757d",
                            color: "white",
                            padding: "0.75rem",
                            fontSize: "1rem",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Cancelar
                    </button>
                </div>

            </form>

        </>
    );
};

export default HotelEdit;