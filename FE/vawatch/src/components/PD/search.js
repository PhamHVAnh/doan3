import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Fuse from "fuse.js";

const TimKiemSanPham = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [sanPhams, setSanPhams] = useState([]);
  const [query, setQuery] = useState("");
  const [ketQua, setKetQua] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3002/api/sanpham/getall")
      .then(res => setSanPhams(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setKetQua([]);
      setShowResults(false);
      return;
    }
    const fuse = new Fuse(sanPhams, { keys: ["tenSP", "thuongHieu"], threshold: 0.3 });
    const results = fuse.search(query.trim());
    setKetQua(results.map(r => r.item));
    setShowResults(true);
  }, [query, sanPhams]);

  const handleSelect = (sp) => {
    navigate(`/chi-tiet/${sp._id || sp.maSP}`);
    setShowResults(false);
  };

  const getProductImage = (images) => (Array.isArray(images) && images.length > 0) ? `http://localhost:3002${images[0]}` : null;

  return (
    <div className="input-group position-relative" style={{ maxWidth: 600, margin: "auto" }}>
      <input
        type="text"
        className="form-control"
        placeholder="Bạn muốn tìm ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputRef}
        autoComplete="off"
      />
       <div type="submit" className="btn btn-outline-light">
        <i className="bi bi-search"></i>
      </div>

      {showResults && ketQua.length > 0 && (
        <div
          className="list-group shadow-sm"
          style={{
            maxHeight: 400,
            overflowY: "auto",
            zIndex: 9999,
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderTop: "none",
          }}
        >
          {ketQua.map(sp => (
            <button
              key={sp._id || sp.maSP}
              className="list-group-item list-group-item-action d-flex align-items-center"
              onClick={() => handleSelect(sp)}
              type="button"
              style={{ cursor: "pointer" }}
            >
              <img
                src={getProductImage(sp.anhSP)}
                alt={sp.tenSP}
                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, marginRight: 12, border: "1px solid #ddd" }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>{sp.tenSP}</div>
                <div className="text-muted" style={{ fontSize: 14 }}>
                  {sp.thuongHieu && <span>{sp.thuongHieu} • </span>}
                  {sp.giaTien?.toLocaleString()} VND
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimKiemSanPham;
