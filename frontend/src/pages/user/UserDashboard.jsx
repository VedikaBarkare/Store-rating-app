import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStores, getMyRatings } from "../../services/storeService";
import Navbar from "../../components/Navbar";
import Icon from "../../components/Icon";

function StarDisplay({ value, size = "star-sm" }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <Icon key={s} name="star" className={`star ${size} ${s <= Math.round(value) ? "filled" : ""}`} />
      ))}
    </div>
  );
}

function UserDashboard() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [myRatings, setMyRatings] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [storeRes, ratingRes] = await Promise.all([getAllStores(), getMyRatings()]);
      setStores(storeRes.data.stores || []);
      const ratingMap = {};
      (ratingRes.data.ratings || []).forEach((r) => {
        ratingMap[r.storeId] = r.rating;
      });
      setMyRatings(ratingMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = stores.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <div>
            <div className="page-title">Explore Stores</div>
            <div className="page-subtitle">Discover and rate stores near you</div>
          </div>
        </div>

        <div className="search-bar" style={{ marginBottom: 28, maxWidth: 480 }}>
          <Icon name="magnifying-glass" className="search-icon" />
          <input
            className="input"
            type="text"
            placeholder="Search stores by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="store" /></div>
            <p>No stores found</p>
          </div>
        ) : (
          <div className="store-grid">
            {filtered.map((store) => (
              <div key={store.id} className="store-card" onClick={() => navigate(`/stores/${store.id}`)}>
                <div className="store-icon"><Icon name="store" /></div>
                <div className="store-name">{store.name}</div>
                <div className="store-addr"><Icon name="location-dot" className="inline-icon muted-icon" /> {store.address}</div>
                {store.description && (
                  <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.5 }}>
                    {store.description.length > 80 ? `${store.description.slice(0, 80)}...` : store.description}
                  </div>
                )}
                <div className="store-rating-row">
                  <StarDisplay value={store.averageRating || 0} />
                  <span className="store-avg">
                    {store.averageRating ? `${store.averageRating} (${store.ratingCount})` : "No ratings yet"}
                  </span>
                </div>
                {myRatings[store.id] && (
                  <div className="rated-row">
                    <span className="rated-label"><Icon name="circle-check" /> You rated:</span>
                    <StarDisplay value={myRatings[store.id]} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
