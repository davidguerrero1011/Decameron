import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/assignStyles.css';

const FormularioHotel = () => {
  const [categories, setCategories] = useState([]);
  const [accommodationList, setAccommodationList] = useState([]);
  const [accommodationId, setAccommodationId] = useState('');
  const [categoria, setCategoria] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const { id } = useParams();
  const [amount, setCantidad] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const url = `http://127.0.0.1:8000/api/hotels`;

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    listRoomTypes();
  }, []);

  const navigate = useNavigate();
  const handleCancel = () => {
    setCategoria('');
    setCantidad('');
    setSelectedItems([]);
    navigate('/hotels');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const payload = {
        hotel_id: id,
        room_type_id: categoria,
        acommodation_type_id: accommodationId,
        amont: amount
      };

      const response = await axios.post(`${url}/assign`, payload);

      setSuccessMessage(response.data.message || 'Los cuartos del hotel fueron configurados exitosamente.');
      setErrorMessage('');
      setValidationErrors([]);

      if (response.status == 200 && response.data.message == "La configuracion de su hotel fue creada con exito") {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }

    } catch (error) {
      console.log("message error: " + error);
      setSuccessMessage('');
      setValidationErrors([]);
      setErrorMessage('');

      if (error.response && error.response.status === 204) {
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
    }
  };

  const listRoomTypes = async () => {
    try {
      const response = await axios.get(`${url}/room-types`);
      console.log(response);
      
      setCategories(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const listAccommodationTypes = async (roomTypeId) => {
    try {
      const response = await axios.get(`${url}/accommodation-types/${roomTypeId}`);
      if (response.status == 200) {
        setAccommodationList(response.data[0]);
      }
    } catch (error) {
      console.log(error);
      setAccommodationList([]);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center fw-bold mb-5 text-white">Configuración Hotel</h2>

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
        <div className="alert alert-warning" role="alert">
          <ul className="mb-0">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="categoria" className="form-label fw-semibold">Tipos de Habitación</label>
            <select
              id="categoria"
              className="form-select"
              value={categoria}
              onChange={(e) => {
                const selected = e.target.value;
                setCategoria(selected);
                setAccommodationId('');
                listAccommodationTypes(selected);
              }}
              required>
              <option value="">Seleccione una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="item" className="form-label fw-semibold">Acomodaciones</label>
            <div className="input-group">
              <select
                id="item"
                className="form-select"
                value={accommodationId}
                onChange={(e) => setAccommodationId(e.target.value)}
              >
                <option value="0">Seleccione una acomodación</option>
                {accommodationList.map((accommodation) => (
                  <option key={accommodation.id} value={accommodation.id}>{accommodation.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo de número */}
          <div className="col-12 col-md-6 mt-3">
            <label htmlFor="cantidad" className="form-label fw-semibold">Cantidad</label>
            <div className="input-group">
              <input
                type="number"
                id="cantidad"
                className="form-control"
                min="1"
                placeholder="Ingrese una cantidad"
                value={amount}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between flex-column flex-sm-row gap-3">
          <button
            type="button"
            className="btn btn-secondary w-100 w-sm-auto"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary w-100 w-sm-auto"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioHotel;