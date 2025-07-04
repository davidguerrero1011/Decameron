import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/createStyle.css";

const CreateHotel = () => {
  const [cities, setCities] = useState([]);
  const [hotel, setHotel] = useState({
    name: "",
    nit: "",
    address: "",
    city_id: "",
    rooms_capacity: "",
    email: "",
    phone: "",
    status: 0,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    fetchCities();
  }, []);

  const navigate = useNavigate();
  // const url = `http://127.0.0.1:8000/api/hotels`;
  const url = `http://3.148.167.245/api/hotels`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setHotel((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
    } else {
      setHotel((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const hotelToSend = {
      ...hotel,
      status: Number(hotel.status) === 1 ? 1 : 0
    };

    try {
      const response = await axios.post(`${url}/store`, hotelToSend);
      setSuccessMessage(
        response.data.message || "El hotel fue creado de manera exitosa"
      );
      setErrorMessage("");
      setValidationErrors([]);

      if (response.status == 200) {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setSuccessMessage("");
      setValidationErrors([]);
      setErrorMessage("");

      if (error.response && error.response.status === 422) {
        const allErrors = error.response.data.errors;
        const messages = [];

        for (let field in allErrors) {
          messages.push(...allErrors[field]);
        }

        setValidationErrors(messages);
      } else if (
            error.response &&
            error.response.data &&
            error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "Ocurrió algún inconveniente a la hora de crear el hotel."
        );
      }
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${url}/cities`);
      setCities(response.data[0]);
    } catch (error) {
      console.error("Error al obtener ciudades:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 my-4">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "3000px", width: "100%", borderRadius: "1rem" }}
      >
        <h2 className="text-center mb-4">Crear Hotel</h2>

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

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={hotel.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">NIT</label>
              <input
                type="text"
                name="nit"
                className="form-control"
                value={hotel.nit}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={hotel.address}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Ciudad</label>
              <select
                name="city_id"
                className="form-select"
                value={hotel.city_id}
                onChange={handleChange}
              >
                <option value="0">Selecciona una ciudad</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Cuartos</label>
              <input
                type="number"
                name="rooms_capacity"
                className="form-control"
                value={hotel.rooms_capacity}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={hotel.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">telefono</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={hotel.phone}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3 d-flex align-items-center">
              <div className="form-check mt-3">
                <input
                  type="checkbox"
                  name="status"
                  className="form-check-input"
                  checked={hotel.status}
                  onChange={handleChange}
                  id="statusCheck"
                />
                <label className="form-check-label ms-2" htmlFor="statusCheck">
                  Activo
                </label>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn btn-primary me-2">
              Guardar
            </button>
            <button
              type="button"
              onClick={() => navigate("/hotels")}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHotel;