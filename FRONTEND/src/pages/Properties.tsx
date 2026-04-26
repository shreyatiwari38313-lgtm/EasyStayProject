import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal } from "lucide-react";
import properties from "@/lib/propertiesData";

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState([1000, 10000]);
  const [guests, setGuests] = useState("any");
  const [sortBy, setSortBy] = useState("recommended");

  // ✅ Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // 🔥 ✅ FETCH WISHLIST ON LOAD
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/wishlist");

        // using title as identifier (since DB doesn't store id)
        const ids = res.data.map((item: any) => item.title);
        setWishlistIds(ids);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  // 🔥 ✅ ADD TO WISHLIST
  const addToWishlist = async (property: any) => {
    console.log("Sending:", property);  // 🔥 ADD THIS LINE HERE
    try {
      await axios.post("http://localhost:8000/api/v1/wishlist", {
      propertyId: property.id,   // ✅ MUST MATCH MODEL
      title: property.title,
      location: property.location,
      price: property.price,
      image: property.imageUrl,
      type: property.category,
      bedrooms: property.bedrooms || 2,
      guests: property.guests,
});

      alert("Added to wishlist ❤️");

      // ✅ update UI instantly
      setWishlistIds((prev) => [...prev, property.title]);

    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties.filter((property) => {
      const matchesSearch = property.location
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesType =
        propertyType === "all" ||
        property.category.toLowerCase() === propertyType;

      const matchesPrice =
        property.price >= priceRange[0] &&
        property.price <= priceRange[1];

      const matchesGuests =
        guests === "any" || property.guests >= parseInt(guests);

      return (
        matchesSearch &&
        matchesType &&
        matchesPrice &&
        matchesGuests
      );
    });

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [searchTerm, propertyType, priceRange, guests, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Explore Properties</h1>

        <div className="grid lg:grid-cols-4 gap-8">

          {/* Sidebar unchanged */}
          <aside className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Filters</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Location</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Where to?"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Property Type</label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="cabin">Cabin</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-4 block">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <Slider
                    min={1000}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Guests</label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                      <SelectItem value="6">6+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" disabled>
                  Filters Applied
                </Button>
              </div>
            </div>
          </aside>

          {/* Properties */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {filteredAndSortedProperties.length} properties
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  addToWishlist={addToWishlist}

                  // 🔥 ✅ THIS WAS MISSING
                  isWishlisted={wishlistIds.includes(property.title)}
                />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Button variant="outline" size="lg">
                Load More Properties
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;





// import { useState, useMemo } from "react";
// import axios from "axios"; // ✅ ADD THIS
// import Navbar from "@/components/Navbar";
// import PropertyCard from "@/components/PropertyCard";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Search, SlidersHorizontal } from "lucide-react";
// import properties from "@/lib/propertiesData";

// const Properties = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [propertyType, setPropertyType] = useState("all");
//   const [priceRange, setPriceRange] = useState([1000, 10000]);
//   const [guests, setGuests] = useState("any");
//   const [sortBy, setSortBy] = useState("recommended");
//   //Storing wishlist IDs
//   const [wishlistIds, setWishlistIds] = useState<string[]>([]);

//   const addToWishlist = async (property: any) => {
//   try {
//     await axios.post("http://localhost:8000/api/v1/wishlist", {
//       title: property.title,
//       location: property.location,
//       price: property.price,
//       image: property.imageUrl, // ✅ FIXED
//       type: property.category,
//       bedrooms: property.bedrooms || 2,
//       guests: property.guests,
//     });

//     alert("Added to wishlist ❤️");

//     // ✅ FIXED: use id (not _id)
//     setWishlistIds((prev) => [...prev, property.id]);

//   } catch (error) {
//     console.error("Error adding to wishlist:", error);
//   }
// };
//   const filteredAndSortedProperties = useMemo(() => {
//     let filtered = properties.filter((property) => {
//       const matchesSearch = property.location
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase());

//       const matchesType =
//         propertyType === "all" || property.category.toLowerCase() === propertyType;

//       const matchesPrice =
//         property.price >= priceRange[0] && property.price <= priceRange[1];

//       const matchesGuests =
//         guests === "any" || property.guests >= parseInt(guests);

//       return matchesSearch && matchesType && matchesPrice && matchesGuests;
//     });

//     if (sortBy === "price-low") {
//       filtered.sort((a, b) => a.price - b.price);
//     } else if (sortBy === "price-high") {
//       filtered.sort((a, b) => b.price - a.price);
//     } else if (sortBy === "rating") {
//       filtered.sort((a, b) => b.rating - a.rating);
//     }

//     return filtered;
//   }, [searchTerm, propertyType, priceRange, guests, sortBy]);

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold mb-8">Explore Properties</h1>

//         <div className="grid lg:grid-cols-4 gap-8">
          
//           {/* Sidebar unchanged */}
//           <aside className="lg:col-span-1">
//             <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
//               <div className="flex items-center gap-2 mb-6">
//                 <SlidersHorizontal className="h-5 w-5" />
//                 <h2 className="text-xl font-semibold">Filters</h2>
//               </div>

//               <div className="space-y-6">
//                 {/* filters same */}
//                 <div>
//                   <label className="text-sm font-medium mb-2 block">Search Location</label>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Where to?"
//                       className="pl-10"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">Property Type</label>
//                   <Select value={propertyType} onValueChange={setPropertyType}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="All Types" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Types</SelectItem>
//                       <SelectItem value="apartment">Apartment</SelectItem>
//                       <SelectItem value="villa">Villa</SelectItem>
//                       <SelectItem value="cabin">Cabin</SelectItem>
//                       <SelectItem value="studio">Studio</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-4 block">
//                     Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
//                   </label>
//                   <Slider
//                     min={1000}
//                     max={10000}
//                     step={100}
//                     value={priceRange}
//                     onValueChange={setPriceRange}
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block">Guests</label>
//                   <Select value={guests} onValueChange={setGuests}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Any" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="any">Any</SelectItem>
//                       <SelectItem value="1">1 Guest</SelectItem>
//                       <SelectItem value="2">2 Guests</SelectItem>
//                       <SelectItem value="4">4 Guests</SelectItem>
//                       <SelectItem value="6">6+ Guests</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <Button className="w-full" disabled>
//                   Filters Applied
//                 </Button>
//               </div>
//             </div>
//           </aside>

//           {/* Properties */}
//           <div className="lg:col-span-3">
//             <div className="flex items-center justify-between mb-6">
//               <p className="text-muted-foreground">
//                 Showing {filteredAndSortedProperties.length} properties
//               </p>
//             </div>

//             <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {filteredAndSortedProperties.map((property) => (
//                 <PropertyCard
//                   key={property.id}
//                   {...property}
//                   addToWishlist={addToWishlist}   // ✅ PASS FUNCTION
//                 />
//               ))}
//             </div>

//             <div className="mt-12 flex justify-center">
//               <Button variant="outline" size="lg">
//                 Load More Properties
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Properties;



