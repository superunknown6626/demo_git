import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import { FiEdit, FiTrash, FiEye } from 'react-icons/fi';
import { ObjetoPerdidoService } from '../services/ObjetoPerdido/objetoPerdidoService';
import { IncidenteService } from '../services/Incidente/incidenteService';

export interface ObjetoPerdidoResponseDto {
  id: number;
  piso: string;
  ubicacion: string;
  estadoReporte: string;
  estadoTarea: string;
  detalle: string;
  email: string;
  phoneNumber: string;
}

export interface IncidenteResponseDto {
  id: number;
  descripcion: string;
  ubicacion: string;
  fecha: string;
  email: string;
  phoneNumber: string;
}

const Report_Admin = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('lostObjects');
  const [lostObjects, setLostObjects] = useState<ObjetoPerdidoResponseDto[]>([]);
  const [incidents, setIncidents] = useState<IncidenteResponseDto[]>([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Obtener los datos de los objetos perdidos al cargar el componente
  useEffect(() => {
    const fetchLostObjects = async () => {
      try {
        const service = new ObjetoPerdidoService();
        const lostObjectsData = await service.getAllObjetosPerdidos();
        setLostObjects(lostObjectsData);
      } catch (error) {
        console.error('Error al obtener objetos perdidos:', error);
      }
    };

    fetchLostObjects();
  }, []);

  // Obtener los datos de los incidentes al cargar el componente
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const service = new IncidenteService();
        const incidentsData = await service.getAllIncidentes();
        setIncidents(incidentsData);
      } catch (error) {
        console.error('Error al obtener incidentes:', error);
      }
    };

    fetchIncidents();
  }, []);

  const handleAddLostObject = () => {
    navigate('/lost-objects/create');
  };

  const handleAddIncident = () => {
    navigate('/incidents/create');
  };

  const handleEditLostObject = (id: number) => {
    navigate(`/lost-objects/edit/${id}`);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset the page when changing entries per page
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const totalPages = Math.ceil(
    (userRole === 'lostObjects' ? lostObjects.length : incidents.length) / entriesPerPage
  );

  // Paginar los objetos perdidos
  const currentLostObjects = lostObjects.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Paginar los incidentes
  const currentIncidents = incidents.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleDeleteLostObject = async (id: number) => {
    const confirmed = window.confirm('¿Está seguro de que desea eliminar este objeto perdido?');
    if (confirmed) {
      try {
        const service = new ObjetoPerdidoService();
        await service.deleteObjetoPerdido(id);
        setLostObjects(lostObjects.filter((lostObject) => lostObject.id !== id));
      } catch (error) {
        console.error('Error al eliminar el objeto perdido:', error);
      }
    }
  };

  const handleDeleteIncident = async (id: number) => {
    const confirmed = window.confirm('¿Está seguro de que desea eliminar este incidente?');
    if (confirmed) {
      try {
        const service = new IncidenteService();
        await service.deleteIncidente(id);
        setIncidents(incidents.filter((incident) => incident.id !== id));
      } catch (error) {
        console.error('Error al eliminar el incidente:', error);
      }
    }
  };

  return (
    <div className="bg-[#f5f5ff] flex min-h-screen">
      <Navbar />
      <main className="flex-1 p-4">
        <header className="navbar bg-base-100 shadow-lg mb-4">
          <div className="flex items-center">
            <div
              className="toggle-sidebar-btn mr-4"
              style={{
                fontSize: '32px',
                paddingLeft: '10px',
                cursor: 'pointer',
                color: '#012970',
              }}
            >
              &#9776;
            </div>
          </div>
          <div className="flex items-center ml-auto">
            <button className="btn btn-ghost">
              <span className="material-icons">notifications</span>
            </button>
            <span className="badge">3</span>
          </div>
        </header>

        <h2 className="text-2xl font-bold mb-1 ml-4">Reportes</h2>
        <div className="flex space-x-4 mb-4 ml-4">
          {userRole === 'lostObjects' && (
            <button onClick={() => setUserRole('incidents')} className="btn bg-blue-500 text-white">
              Ver Incidentes
            </button>
          )}
          {userRole === 'incidents' && (
            <button onClick={() => setUserRole('lostObjects')} className="btn bg-blue-500 text-white">
              Ver Objetos Perdidos
            </button>
          )}
        </div>

        <div className="flex space-x-4 mt-4">
          {userRole === 'lostObjects' && (
            <div className="bg-white p-4 rounded-lg shadow-md flex-1 flex flex-col">
              <h3 className="text-lg font-semibold">Objetos Perdidos</h3>
              <div className="flex justify-end mb-4">

              </div>
              <div className="flex items-center mb-4">
                <select
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  className="border border-gray-300 rounded p-1 mr-2"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-base">Entradas por página</span>
              </div>
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="w-full text-left text-sm text-black uppercase tracking-wider">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Piso</th>
                    <th className="py-2 px-3">Ubicación</th>
                    <th className="py-2 px-3">Detalle</th>
                    <th className="py-2 px-3">Correo</th>
                    <th className="py-2 px-3">Teléfono</th>
                    <th className="py-2 px-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLostObjects.map((lostObject) => (
                    <tr key={lostObject.id} className="border-t">
                      <td className="py-2 px-3">{lostObject.id}</td>
                      <td className="py-2 px-3">{lostObject.piso}</td>
                      <td className="py-2 px-3">{lostObject.ubicacion}</td>
                      <td className="py-2 px-3">{lostObject.detalle}</td>
                      <td className="py-2 px-3">{lostObject.email}</td>
                      <td className="py-2 px-3">{lostObject.phoneNumber}</td>
                      <td className="py-2 px-3 flex items-center space-x-2">
                        <FiTrash onClick={() => handleDeleteLostObject(lostObject.id)} className="text-red-600 cursor-pointer" />
                        <FiEye onClick={() => navigate(`/lost-objects/${lostObject.id}`)} className="text-blue-600 cursor-pointer" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex justify-between items-center">
                <button
                  className="btn bg-blue-500 text-white"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </button>
                <span className="text-center text-xl">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="btn bg-blue-500 text-white"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {userRole === 'incidents' && (
            <div className="bg-white p-4 rounded-lg shadow-md flex-1 flex flex-col">
              <h3 className="text-lg font-semibold">Incidentes</h3>
              <div className="flex justify-end mb-4">
                <button onClick={handleAddIncident} className="btn bg-green-500 text-white mr-2">
                  Crear Incidente
                </button>
              </div>
              <div className="flex items-center mb-4">
                <select
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  className="border border-gray-300 rounded p-1 mr-2"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-base">Entradas por página</span>
              </div>
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="w-full text-left text-sm text-black uppercase tracking-wider">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Descripción</th>
                    <th className="py-2 px-3">Ubicación</th>
                    <th className="py-2 px-3">Fecha</th>
                    <th className="py-2 px-3">Correo</th>
                    <th className="py-2 px-3">Teléfono</th>
                    <th className="py-2 px-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentIncidents.map((incident) => (
                    <tr key={incident.id} className="border-t">
                      <td className="py-2 px-3">{incident.id}</td>
                      <td className="py-2 px-3">{incident.descripcion}</td>
                      <td className="py-2 px-3">{incident.ubicacion}</td>
                      <td className="py-2 px-3">{incident.fecha}</td>
                      <td className="py-2 px-3">{incident.email}</td>
                      <td className="py-2 px-3">{incident.phoneNumber}</td>
                      <td className="py-2 px-3 flex items-center space-x-2">
                        <FiTrash onClick={() => handleDeleteIncident(incident.id)} className="text-red-600 cursor-pointer" />
                        <FiEye onClick={() => navigate(`/incidents/${incident.id}`)} className="text-blue-600 cursor-pointer" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex justify-between items-center">
                <button
                  className="btn bg-blue-500 text-white"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </button>
                <span className="text-center text-xl">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="btn bg-blue-500 text-white"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Report_Admin;