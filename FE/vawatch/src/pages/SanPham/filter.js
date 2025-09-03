// import React, { useEffect, useState } from "react";
// import ProductList from "../../components/PD/ProductList";
// import filterOptions from "./data/option";
// import { filterProducts } from "../../services/sanPhamService";

// const brands = ["LONGINES", "TISSOT", "MIDO", "HAMILTON", "CERTINA", "MAURICE LACROIX", "FREDERIQUE CONSTANT", "CALVIN KLEIN"];
// const priceRanges = [
//   { label: "Dưới 2 triệu", min: 0, max: 2000000 },
//   { label: "2 - 5 triệu", min: 2000000, max: 5000000 },
//   { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
//   { label: "10 - 20 triệu", min: 10000000, max: 20000000 },
//   { label: "20 - 30 triệu", min: 20000000, max: 30000000 },
//   { label: "30 - 50 triệu", min: 30000000, max: 50000000 },
//   { label: "50 - 100 triệu", min: 50000000, max: 100000000 },
//   { label: "Trên 100 triệu", min: 100000000, max: 1000000000 },
// ];
// const movements = ["AUTOMATIC", "QUARTZ", "ECO-DRIVE", "QUARTZ CHRONOGRAPH", "AUTOMATIC CHRONOMETER", "QUARTZ CHRONOMETER"];
// const materials = ["DÂY DA", "DÂY KIM LOẠI", "THÉP KHÔNG GỈ 316L MẠ VÀNG", "THÉP KHÔNG GỈ 316L DẠNG LƯỚI", "THÉP KHÔNG GỈ 316L DẠNG LẮC", "THÉP KHÔNG GỈ/ VÀNG 18K", "THÉP KHÔNG GỈ/ CERAMIC", "THÉP KHÔNG GỈ MẠ CÔNG NGHỆ"];

// const Filter = () => {
//   const [selectedBrands, setSelectedBrands] = useState([]);
//   const [selectedPrices, setSelectedPrices] = useState([]);
//   const [selectedMovements, setSelectedMovements] = useState([]);
//   const [selectedMaterials, setSelectedMaterials] = useState([]);
//   const [products, setProducts] = useState([]);

//   const handleFilterChange = (value, setter, selected) => {
//     setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
//   };

//   const fetchProducts = async () => {
//     // Lấy min/max theo các khoảng giá được chọn
//     const minPrice = selectedPrices.length > 0 ? Math.min(...selectedPrices.map(p => p.min)) : undefined;
//     const maxPrice = selectedPrices.length > 0 ? Math.max(...selectedPrices.map(p => p.max)) : undefined;

//     const filters = {
//       thuonghieu: selectedBrands.join(","),
//       loaimay: selectedMovements.join(","),
//       chatlieu: selectedMaterials.join(","),
//       minPrice,
//       maxPrice,
//     };

//     const result = await filterProducts(filters);
//     setProducts(result);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [selectedBrands, selectedPrices, selectedMovements, selectedMaterials]);

//   return (
//     <div style={{ display: "flex", gap: "2rem" }}>
//       {/* Bộ lọc */}
//       <div style={{ width: "300px" }}>
//         <h3>Thương hiệu</h3>
//         {brands.map((brand, index) => (
//           <div key={index}>
//             <input
//               type="checkbox"
//               onChange={() => handleFilterChange(brand, setSelectedBrands, selectedBrands)}
//               checked={selectedBrands.includes(brand)}
//             />
//             <label> {brand}</label>
//           </div>
//         ))}

//         <h3>Mức giá</h3>
//         {priceRanges.map((range, index) => (
//           <div key={index}>
//             <input
//               type="checkbox"
//               onChange={() => handleFilterChange(range, setSelectedPrices, selectedPrices)}
//               checked={selectedPrices.includes(range)}
//             />
//             <label> {range.label}</label>
//           </div>
//         ))}

//         <h3>Loại máy</h3>
//         {movements.map((type, index) => (
//           <div key={index}>
//             <input
//               type="checkbox"
//               onChange={() => handleFilterChange(type, setSelectedMovements, selectedMovements)}
//               checked={selectedMovements.includes(type)}
//             />
//             <label> {type}</label>
//           </div>
//         ))}

//         <h3>Chất liệu dây</h3>
//         {materials.map((mat, index) => (
//           <div key={index}>
//             <input
//               type="checkbox"
//               onChange={() => handleFilterChange(mat, setSelectedMaterials, selectedMaterials)}
//               checked={selectedMaterials.includes(mat)}
//             />
//             <label> {mat}</label>
//           </div>
//         ))}
//       </div>

//       {/* Danh sách sản phẩm */}
//       <div style={{ flex: 1 }}>
//         <h2>Sản phẩm</h2>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
//           {products.map((sp) => (
//             <div key={sp.maSP} style={{ border: "1px solid #ccc", padding: "1rem" }}>
//               <img src={sp.anhSP?.[0]} alt={sp.tenSP} width="100%" />
//               <h4>{sp.tenSP}</h4>
//               <p>Giá: {sp.giaTien.toLocaleString()} VND</p>
//               <p>Thương hiệu: {sp.Thuonghieu}</p>
//               <p>Loại máy: {sp.Loaimay}</p>
//               <p>Chất liệu: {sp.Chatlieu}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Filter;
