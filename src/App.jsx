import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import HotelList from './pages/HotelList';
import CreateHotel from './pages/CreateHotel';
import HotelEdit from './pages/HotelEdit';
import AssignHotel from './pages/HotelAssing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HotelList />} />
        <Route path='/hotels/create' element={<CreateHotel />} />
        <Route path='/hotels/edit/:id' element={<HotelEdit />} />
        <Route path='/hotels/assign/:id' element={<AssignHotel />} />
        <Route path='*' element={<HotelList />} />
      </Routes>
    </Router>
  )
}

export default App
