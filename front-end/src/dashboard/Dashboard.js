import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../dashboard/Reservation";
import Table from "../dashboard/Table";
import DateNavigation from "./DateNavigation";

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]); //Stores the tables
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables) //update tables state
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const reservationList = reservations.map((reservation) => (
    <Reservation
      key={reservation.reservation_id}
      reservation={reservation}
      loadDashboard={loadDashboard}
    />
  ));

  const reservationContent = reservations.length ? (
    <div>
      <div>
        <div>{reservationList}</div>
      </div>
    </div>
  ) : (
    <h3>No reservations found</h3>
  );

  const tableList = tables.map((table) => (
    <Table key={table.table_id} table={table} loadDashboard={loadDashboard} />
  ));

  const tableContent = tables.length ? (
    <div>
      <h4>Tables:</h4>
      {tableList} {/* renders the list of Table components */}
    </div>
  ) : (
    <h3>No Tables Found</h3>
  );

  return (
    <main>
      <div>
        <h1>Dashboard</h1>
        <DateNavigation date={date} />
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div>
        <h4>Reservations for {date}</h4>
        {reservationContent}
      </div>
      <div>{tableContent}</div>
    </main>
  );
}

export default Dashboard;
