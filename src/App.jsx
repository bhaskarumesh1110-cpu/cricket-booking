import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [matches, setMatches] = useState([])
  const [selectedMatch, setSelectedMatch] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [tickets, setTickets] = useState(1)

  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [message, setMessage] = useState('')

  // Load matches from Supabase
  useEffect(() => {
    loadMatches()
  }, [])

  async function loadMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('match_date', { ascending: true })

    if (error) {
      console.error(error)
      setMessage('Error loading matches: ' + error.message)
    } else {
      setMatches(data || [])
    }

    setLoading(false)
  }

  // Book ticket
  async function handleBooking(e) {
    e.preventDefault()

    if (!selectedMatch) {
      setMessage('Please select a match.')
      return
    }

    if (!customerName || !email || tickets < 1) {
      setMessage('Please fill all details correctly.')
      return
    }

    setBooking(true)
    setMessage('')

    const { error } = await supabase
      .from('bookings')
      .insert([
        {
          match_id: Number(selectedMatch),
          customer_name: customerName,
          email: email,
          tickets: Number(tickets)
        }
      ])

    if (error) {
      console.error(error)
      setMessage('Booking failed: ' + error.message)
    } else {
      setMessage('✅ Ticket booked successfully!')

      setCustomerName('')
      setEmail('')
      setTickets(1)
      setSelectedMatch('')
    }

    setBooking(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        fontFamily: 'Arial, sans-serif',
        paddingBottom: '50px'
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: '#172554',
          color: 'white',
          padding: '25px',
          textAlign: 'center'
        }}
      >
        <h1>🏏 Cricket Ticket Booking</h1>
        <p>Book your tickets for upcoming matches</p>
      </header>

      {/* Matches */}
      <main style={{ maxWidth: '1000px', margin: '30px auto', padding: '20px' }}>
        <h2>🏟️ Upcoming Matches</h2>

        {loading && <p>Loading matches...</p>}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}
        >
          {matches.map((match) => (
            <div
              key={match.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <h3>
                {match.team1} VS {match.team2}
              </h3>

              <p>📅 Date: {match.match_date}</p>
              <p>⏰ Time: {match.match_time}</p>
              <p>🏟️ Venue: {match.venue}</p>

              <button
                onClick={() => setSelectedMatch(String(match.id))}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor:
                    selectedMatch === String(match.id)
                      ? '#16a34a'
                      : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {selectedMatch === String(match.id)
                  ? '✓ Selected'
                  : 'Select Match'}
              </button>
            </div>
          ))}
        </div>

        {/* Booking Form */}
        <div
          style={{
            backgroundColor: 'white',
            maxWidth: '600px',
            margin: '40px auto',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <h2>🎟️ Book Your Tickets</h2>

          <form onSubmit={handleBooking}>
            <label>Customer Name</label>

            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              style={inputStyle}
            />

            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={inputStyle}
            />

            <label>Number of Tickets</label>

            <input
              type="number"
              min="1"
              max="10"
              value={tickets}
              onChange={(e) => setTickets(e.target.value)}
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={booking}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '15px'
              }}
            >
              {booking ? 'Booking...' : '🎫 Book Ticket'}
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: '20px',
                fontWeight: 'bold'
              }}
            >
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  marginBottom: '15px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  boxSizing: 'border-box'
}

export default App