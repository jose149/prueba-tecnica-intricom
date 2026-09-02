import React, { useEffect, useState } from "react";
import "./index.css";

interface Client {
  id: number;
  name: string;
  address: string;
  phone: string;
  createdDate: string;
}

interface Hotel {
  id: number;
  name: string;
  address: string;
  createdDate: string;
}

interface HotelBooking {
  id: number;
  hotelId: number;
  name: string;
  address: string;
  createdDate: string;
  clientId: number;
}

const API_URL = "http://localhost:3000";

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<HotelBooking[]>([]);

  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [editingClientId, setEditingClientId] = useState<number | null>(null);

  const [hotelName, setHotelName] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [editingHotelId, setEditingHotelId] = useState<number | null>(null);

  const [bookingHotelId, setBookingHotelId] = useState("");
  const [bookingClientId, setBookingClientId] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingAddress, setBookingAddress] = useState("");
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);

  const loadData = async () => {
    const [clientsResponse, hotelsResponse, bookingsResponse] =
      await Promise.all([
        fetch(`${API_URL}/clients`),
        fetch(`${API_URL}/hotels`),
        fetch(`${API_URL}/hotel-bookings`),
      ]);

    setClients(await clientsResponse.json());
    setHotels(await hotelsResponse.json());
    setBookings(await bookingsResponse.json());
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const [clientsResponse, hotelsResponse, bookingsResponse] =
        await Promise.all([
          fetch(`${API_URL}/clients`),
          fetch(`${API_URL}/hotels`),
          fetch(`${API_URL}/hotel-bookings`),
        ]);

      const [clientsData, hotelsData, bookingsData] = await Promise.all([
        clientsResponse.json(),
        hotelsResponse.json(),
        bookingsResponse.json(),
      ]);

      setClients(clientsData);
      setHotels(hotelsData);
      setBookings(bookingsData);
    };

    loadInitialData();
  }, []);

  // ---------------- CLIENTS ----------------

  const handleClientSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const body = {
      name: clientName,
      address: clientAddress,
      phone: clientPhone,
    };

    if (editingClientId !== null) {
      await fetch(`${API_URL}/clients/${editingClientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    resetClientForm();
    await loadData();
  };

  const editClient = (client: Client) => {
    setEditingClientId(client.id);
    setClientName(client.name);
    setClientAddress(client.address);
    setClientPhone(client.phone);
  };

  const resetClientForm = () => {
    setEditingClientId(null);
    setClientName("");
    setClientAddress("");
    setClientPhone("");
  };

  // ---------------- HOTELS ----------------

  const handleHotelSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = {
      name: hotelName,
      address: hotelAddress,
    };

    if (editingHotelId !== null) {
      await fetch(`${API_URL}/hotels/${editingHotelId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(`${API_URL}/hotels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    resetHotelForm();
    await loadData();
  };

  const editHotel = (hotel: Hotel) => {
    setEditingHotelId(hotel.id);
    setHotelName(hotel.name);
    setHotelAddress(hotel.address);
  };

  const resetHotelForm = () => {
    setEditingHotelId(null);
    setHotelName("");
    setHotelAddress("");
  };

  // ---------------- BOOKINGS ----------------

  const handleBookingSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const body = {
      hotelId: Number(bookingHotelId),
      clientId: Number(bookingClientId),
      name: bookingName,
      address: bookingAddress,
    };

    if (editingBookingId !== null) {
      await fetch(`${API_URL}/hotel-bookings/${editingBookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(`${API_URL}/hotel-bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    resetBookingForm();
    await loadData();
  };

  const editBooking = (booking: HotelBooking) => {
    setEditingBookingId(booking.id);
    setBookingHotelId(String(booking.hotelId));
    setBookingClientId(String(booking.clientId));
    setBookingName(booking.name);
    setBookingAddress(booking.address);
  };

  const resetBookingForm = () => {
    setEditingBookingId(null);
    setBookingHotelId("");
    setBookingClientId("");
    setBookingName("");
    setBookingAddress("");
  };

  const getHotelName = (hotelId: number) => {
    return hotels.find((hotel) => hotel.id === hotelId)?.name ?? `#${hotelId}`;
  };

  const getClientName = (clientId: number) => {
    return (
      clients.find((client) => client.id === clientId)?.name ?? `#${clientId}`
    );
  };

  return (
    <main className="container">
      <header>
        <h1>Hotel Booking Management</h1>
        <p>Hotel, client and booking management system</p>
      </header>

      {/* CLIENTS */}

      <section className="card">
        <h2>Clients</h2>

        <form onSubmit={handleClientSubmit} className="form">
          <input
            placeholder="Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />

          <input
            placeholder="Address"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            required
          />

          <input
            placeholder="Phone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            required
          />

          <button type="submit">
            {editingClientId !== null ? "Save" : "Create"}
          </button>

          {editingClientId !== null && (
            <button
              type="button"
              className="secondary"
              onClick={resetClientForm}
            >
              Cancel
            </button>
          )}
        </form>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.address}</td>
                <td>{client.phone}</td>
                <td>
                  <button onClick={() => editClient(client)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* HOTELS */}

      <section className="card">
        <h2>Hotels</h2>

        <form onSubmit={handleHotelSubmit} className="form">
          <input
            placeholder="Hotel name"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            required
          />

          <input
            placeholder="Address"
            value={hotelAddress}
            onChange={(e) => setHotelAddress(e.target.value)}
            required
          />

          <button type="submit">
            {editingHotelId !== null ? "Save" : "Create"}
          </button>

          {editingHotelId !== null && (
            <button
              type="button"
              className="secondary"
              onClick={resetHotelForm}
            >
              Cancel
            </button>
          )}
        </form>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.id}</td>
                <td>{hotel.name}</td>
                <td>{hotel.address}</td>
                <td>
                  <button onClick={() => editHotel(hotel)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* BOOKINGS */}

      <section className="card">
        <h2>Hotel Bookings</h2>

        <form onSubmit={handleBookingSubmit} className="form">
          <select
            value={bookingHotelId}
            onChange={(e) => setBookingHotelId(e.target.value)}
            required
          >
            <option value="">Select hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>

          <select
            value={bookingClientId}
            onChange={(e) => setBookingClientId(e.target.value)}
            required
          >
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Name"
            value={bookingName}
            onChange={(e) => setBookingName(e.target.value)}
            required
          />

          <input
            placeholder="Address"
            value={bookingAddress}
            onChange={(e) => setBookingAddress(e.target.value)}
            required
          />

          <button type="submit">
            {editingBookingId !== null ? "Save" : "Create"}
          </button>

          {editingBookingId !== null && (
            <button
              type="button"
              className="secondary"
              onClick={resetBookingForm}
            >
              Cancel
            </button>
          )}
        </form>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Hotel</th>
              <th>Client</th>
              <th>Name</th>
              <th>Address</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{getHotelName(booking.hotelId)}</td>
                <td>{getClientName(booking.clientId)}</td>
                <td>{booking.name}</td>
                <td>{booking.address}</td>
                <td>
                  <button onClick={() => editBooking(booking)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default App;
