import './Ticker.scss';

export default function Ticker() {
  const tickerItems = [
    "Flight & Train Bookings",
    "Private Cab Rentals",
    "Mountain Honeymoon Packages",
    "Group Tour Departures",
    "Certified Local Guides",
    "Airport Transfers",
    "Custom Family Itineraries",
    "Shimla & Manali Circuits",
    "Kashmir Houseboat Stays",
    "Ladakh 4x4 Mountain Safaris"
  ];

  return (
    <div className="scrolling-ticker">
      <div className="ticker-track">
        {tickerItems.concat(tickerItems).map((text, idx) => (
          <div key={idx} className="ticker-item">
            <i className="fa-solid fa-asterisk"></i> {text}
          </div>
        ))}
      </div>
    </div>
  );
}
