import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/editStyle.css";

const HotelEdit = () => {
  const [cities, setCities] = useState([]);
  const [hotel, setHotel] = useState({
    name: "",
    address: "",
    city_id: 0,
    nit: "",
    rooms: 0,
    status: null,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const url = `http://127.0.0.1:8000/api/hotels`;

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`${url}/show/${id}`);
        const data = response.data[0];

        setSuccessMessage("");
        setErrorMessage("");
        setValidationErrors([]);

        setHotel({
          name: data.name || "",
          nit: data.nit || "",
          address: data.address || "",
          city_id: data.city_id || 0,
          rooms_capacity: data.rooms_capacity || 0,
          email: data.email || "",
          phone: data.phone || "",
          status: data.status,
        });
      } catch (error) {
        console.error("Error cargando hotel:", error);

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
    try {
      const response = await axios.get(`${url}/cities`);
      setCities(response.data[0]);
    } catch (error) {
      console.error("Error al obtener ciudades:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await axios.put(`${url}/update/${id}`, hotel);
      
      Swal.fire({
        title: `${response.data.message}`,
        icon: response.status == 200 ? "success" : "error",
        draggable: true,
      });

      if (response.status == 200) {
        setSuccessMessage(
          response.data.message || "Hotel actualizado correctamente"
        );
        setErrorMessage("");
        setValidationErrors([]);

        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error actualizando hotel:", error);

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
        setErrorMessage("Ocurrió un error inesperado al actualizar el hotel.");
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
              required
            >
              <option value="">Seleccione una ciudad</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rooms_capacity">Habitaciones</label>
            <input
              id="rooms_capacity"
              name="rooms_capacity"
              type="number"
              value={hotel.rooms_capacity}
              onChange={(e) =>
                setHotel({
                  ...hotel,
                  rooms_capacity: parseInt(e.target.value) || 0,
                })
              }
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              value={hotel.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefono</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={hotel.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label htmlFor="status">
              Hotel {hotel.status == 1 ? "Activo" : "Inactivo"}
            </label>
            <input
              type="checkbox"
              name="status"
              className="form-check-input"
              checked={hotel.status}
              onChange={handleChange}
              id="statusCheck"
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
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
              cursor: "pointer",
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
