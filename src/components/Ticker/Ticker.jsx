import './Ticker.scss';

export default function Ticker() {
  const tickerItems = [
    "Shimla & Manali Packages",
    "Atal Tunnel & Sissu Day Trips",
    "Spiti Valley High Expeditions",
    "Kasol & Manikaran Holy Springs",
    "Dharamshala & Kangra Valley Tours",
    "Bir Billing Paragliding Trips",
    "Palampur Tea Garden Retreats",
    "Rohtang Pass Snow Excursions",
    "Chamba & Khajjiar Sightseeing",
    "Chandigarh to Himachal Cabs",
    "Experienced Himachali Chauffeurs",
    "24/7 Mountain-Ready Fleet"
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
