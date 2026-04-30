import { MapPin, Trash2 } from "lucide-react";

const WishlistCard = ({ item, onRemove }: any) => {
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm flex justify-between items-center">

      {/* LEFT: IMAGE + DETAILS */}
      <div className="flex gap-4 items-center flex-1">

        {/* IMAGE */}
        <img
          src={item.image}
          className="w-40 h-28 rounded-xl object-cover"
        />

        {/* DETAILS */}
        <div>
          <h2 className="font-semibold text-lg">{item.title}</h2>

          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin size={14} className="mr-1" />
            {item.location}
          </div>

          <div className="flex gap-2 mt-3 text-xs">
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {item.type}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {item.bedrooms} Bedrooms
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {item.guests} Guests
            </span>
          </div>
        </div>
      </div>

      {/* 🔥 MIDDLE: PRICE */}
      <div className="text-right mr-6">
        <p className="text-lg font-semibold">₹{item.price}</p>
        <p className="text-xs text-gray-500">per night</p>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex flex-col items-end gap-2">
        <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm">
          ❤️ Saved
        </button>

        <div className="flex gap-2">
          <button className="border px-3 py-1 rounded-md text-sm">
            View Details
          </button>

          <button
            onClick={() => onRemove(item._id)}
            className="border p-2 rounded-md"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;







