import { Heart, IndianRupee, MapPin, Calendar } from "lucide-react";

const SummaryBar = ({ items }: { items: any[] }) => {
  const total = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const locations = new Set(items.map((i) => i.location)).size;

  return (
    <div className="bg-white border rounded-2xl p-5 flex justify-between items-center shadow-sm">

      <div className="flex items-center gap-3">
        <div className="bg-red-100 p-2 rounded-full">
          <Heart className="text-red-500" size={16} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Saved</p>
          <p className="font-semibold">{total}</p>
          <p className="text-xs text-gray-400">Properties</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-purple-100 p-2 rounded-full">
          <IndianRupee size={16} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Estimated Total</p>
          <p className="font-semibold">₹{totalPrice} / night</p>
          <p className="text-xs text-gray-400">For all properties</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-full">
          <MapPin size={16} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Most Locations</p>
          <p className="font-semibold">{locations}</p>
          <p className="text-xs text-gray-400">Cities</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-green-100 p-2 rounded-full">
          <Calendar size={16} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Last Saved</p>
          <p className="font-semibold">Today</p>
          <p className="text-xs text-gray-400">2 minutes ago</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryBar;




// import { Heart, IndianRupee, MapPin, Calendar } from "lucide-react";

// const SummaryBar = ({ items }: { items: any[] }) => {
//   const total = items.length;
//   const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
//   const locations = new Set(items.map((i) => i.location)).size;

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6 grid grid-cols-4 gap-6">
      
//       <div className="flex items-center gap-3">
//         <div className="bg-red-100 p-2 rounded-full">
//           <Heart className="text-red-500" size={18} />
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Total Saved</p>
//           <p className="font-semibold text-lg">{total}</p>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="bg-purple-100 p-2 rounded-full">
//           <IndianRupee size={18} />
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Estimated Total</p>
//           <p className="font-semibold text-lg">₹{totalPrice} / night</p>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="bg-blue-100 p-2 rounded-full">
//           <MapPin size={18} />
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Most Locations</p>
//           <p className="font-semibold text-lg">{locations} cities</p>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="bg-green-100 p-2 rounded-full">
//           <Calendar size={18} />
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Last Saved</p>
//           <p className="font-semibold text-lg">Today</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SummaryBar;





