import { useEffect, useState } from "react";
import axios from "axios";
import SummaryBar from "@/components/SummaryBar";
import WishlistCard from "@/components/WishlistCard";
import Navbar from "@/components/Navbar";

const Wishlist = () => {
  const [items, setItems] = useState([]);

  const fetchWishlist = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/wishlist");
    setItems(res.data);
  };

  const removeItem = async (id: string) => {
    await axios.delete(`http://localhost:8080/api/v1/wishlist/${id}`);
    fetchWishlist();
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* ✅ CENTERED CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-gray-500">
              Your saved properties for later
            </p>
          </div>

          <div className="flex gap-3">
            <button className="border border-gray-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-100">
              🔗 Share Wishlist
            </button>

            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow">
              ❤️ Clear All
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <SummaryBar items={items} />

        {/* LIST */}
        <div className="mt-6 space-y-4">
          {items.map((item: any) => (
            <WishlistCard
              key={item._id}
              item={item}
              onRemove={removeItem}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Wishlist;





// import { useEffect, useState } from "react";
// import axios from "axios";
// import SummaryBar from "@/components/SummaryBar";
// import WishlistCard from "@/components/WishlistCard";

// const Wishlist = () => {
//   const [items, setItems] = useState([]);

//   const fetchWishlist = async () => {
//     const res = await axios.get("http://localhost:8000/api/v1/wishlist");
//     setItems(res.data);
//   };

//   const removeItem = async (id: string) => {
//     await axios.delete(`http://localhost:8000/api/v1/wishlist/${id}`);
//     fetchWishlist();
//   };

//   useEffect(() => {
//     fetchWishlist();
//   }, []);

//   return (
//     <div className="p-6"> {/* ✅ MAIN CONTAINER */}

//       {/* 🔷 HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold">My Wishlist</h1>
//           <p className="text-gray-500">Your saved properties for later</p>
//         </div>

//         <div className="flex gap-3">
//           <button className="border px-4 py-2 rounded-lg text-sm">
//             Share Wishlist
//           </button>

//           <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm">
//             ❤️ Clear All
//           </button>
//         </div>
//       </div>

//       {/* 🔷 SUMMARY BAR */}
//       <SummaryBar items={items} />

//       {/* 🔷 LIST */}
//       <div>
//         {items.map((item: any) => (
//           <WishlistCard
//             key={item._id}
//             item={item}
//             onRemove={removeItem}
//           />
//         ))}
//       </div>

//     </div>
//   );
// };

// export default Wishlist;





