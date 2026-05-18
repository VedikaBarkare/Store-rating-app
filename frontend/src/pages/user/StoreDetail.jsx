import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllStores, getMyRatings } from "../../services/storeService";
import { addRating } from "../../services/ratingService";
import Navbar from "../../components/Navbar";
import Icon from "../../components/Icon";
import toast from "react-hot-toast";

function StarPicker({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="rating-stars-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <Icon
          key={s}
          name="star"
          className={`rating-star ${s <= display ? "filled" : ""}`}
          onClick={() => !readonly && onChange(s)}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{ cursor: readonly ? "default" : "pointer" }}
        />
      ))}
    </div>
  );
}

function StoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [myRating, setMyRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tempRating, setTempRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [storeRes, ratingRes] = await Promise.all([getAllStores(), getMyRatings()]);
      const found = (storeRes.data.stores || []).find((s) => s.id === Number(id));
      setStore(found || null);
      const ratingMap = {};
      (ratingRes.data.ratings || []).forEach((r) => {
        ratingMap[r.storeId] = r.rating;
      });
      if (ratingMap[Number(id)]) {
        setMyRating(ratingMap[Number(id)]);
        setTempRating(ratingMap[Number(id)]);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!tempRating) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      await addRating({ rating: tempRating, storeId: Number(id) });
      setMyRating(tempRating);
      setSubmitted(true);
      setEditing(false);
      toast.success(submitted ? "Rating updated!" : "Rating submitted!");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><Navbar /><div className="spinner" /></div>;

  if (!store) {
    return (
      <div className="page">
        <Navbar />
        <div className="page-content">
          <div className="empty-state">
            <div className="empty-icon"><Icon name="store" /></div>
            <p>Store not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        <button className="btn btn-outline btn-sm" onClick={() => navigate("/stores")} style={{ marginBottom: 24 }}>
          <Icon name="arrow-left" /> Back to Stores
        </button>

        <div className="store-detail-header">
          <div className="store-detail-icon"><Icon name="store" /></div>
          <div className="store-detail-info">
            <h1>{store.name}</h1>
            <p><Icon name="location-dot" className="inline-icon" /> {store.address}</p>
            {store.description && <p style={{ marginTop: 6 }}>{store.description}</p>}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Icon key={s} name="star" style={s <= Math.round(store.averageRating || 0) ? { color: "var(--star)" } : { color: "rgba(255,255,255,0.2)" }} />
              ))}
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                {store.averageRating ? `${store.averageRating} avg (${store.ratingCount} ratings)` : "No ratings yet"}
              </span>
            </div>
          </div>
        </div>

        <div className="rating-widget">
          <h3>{submitted && !editing ? "Your Rating" : "Rate This Store"}</h3>

          {submitted && !editing ? (
            <>
              <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 14 }}>You have already rated this store.</p>
              <StarPicker value={myRating} onChange={() => {}} readonly />
              <button className="btn btn-outline btn-sm" style={{ marginTop: 18 }} onClick={() => { setEditing(true); setTempRating(myRating); }}>
                <Icon name="pen-to-square" /> Edit Rating
              </button>
            </>
          ) : (
            <>
              <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 14 }}>
                {editing ? "Update your rating below:" : "Select a star rating below and submit:"}
              </p>
              <StarPicker value={tempRating} onChange={setTempRating} />
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || !tempRating}>
                  {submitting ? "Submitting..." : editing ? "Update Rating" : "Submit Rating"}
                </button>
                {editing && (
                  <button className="btn btn-outline" onClick={() => { setEditing(false); setTempRating(myRating); }}>
                    Cancel
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoreDetail;
