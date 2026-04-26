import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Star, User, Heart, Clock, AlertCircle } from "lucide-react";
import { getMyBookings, cancelBooking, deleteBooking } from "@/api/booking.api";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  _id: string;
  propertyId: {
    _id: string;
    title: string;
    location: string;
    pricePerNight: number;
    image?: string;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "checked_in" | "completed" | "cancelled";
  createdAt: string;
}

const GuestDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyBookings();
      if (response.success) {
        setBookings(response.bookings || []);
      } else {
        setError(response.message || "Failed to load bookings");
      }
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setError(err?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await cancelBooking(bookingId);
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully",
      });
      fetchBookings();
    } catch (err: any) {
      toast({
        title: "Cancellation Failed",
        description: err?.response?.data?.message || "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to delete this booking permanently?")) return;

    try {
      await deleteBooking(bookingId);
      toast({
        title: "Booking Deleted",
        description: "Your booking has been deleted",
      });
      fetchBookings();
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err?.response?.data?.message || "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.checkOut) > now && b.status !== "cancelled"
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.checkOut) <= now || b.status === "cancelled"
  );

  const getDefaultImage = () => {
    return "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your bookings and preferences</p>
          </div>
          <Button size="lg" className="hidden sm:flex">
            <User className="mr-2 h-5 w-5" />
            Edit Profile
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700">{error}</span>
              <Button size="sm" variant="outline" onClick={fetchBookings} className="ml-auto">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <h2 className="text-2xl font-semibold">Upcoming Trips</h2>
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </CardContent>
              </Card>
            ) : upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming trips</h3>
                  <p className="text-muted-foreground mb-6">Time to plan your next adventure!</p>
                  <Button onClick={() => navigate("/properties")}>Browse Properties</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingBookings.map((booking) => (
                  <Card key={booking._id} className="overflow-hidden hover:shadow-card-hover transition-all">
                    <div className="flex">
                      <img 
                        src={booking.propertyId?.image || getDefaultImage()}
                        alt={booking.propertyId?.title}
                        className="w-32 h-full object-cover"
                      />
                      <CardContent className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{booking.propertyId?.title}</h3>
                          <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.propertyId?.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights · {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">₹{booking.totalPrice.toFixed(2)}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/bookings/${booking._id}`)}>
                              Details
                            </Button>
                            {booking.status !== "cancelled" && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleCancelBooking(booking._id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <h2 className="text-2xl font-semibold">Past Trips</h2>
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </CardContent>
              </Card>
            ) : pastBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No past trips yet</h3>
                  <p className="text-muted-foreground">Your travel history will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {pastBookings.map((booking) => (
                  <Card key={booking._id} className="overflow-hidden">
                    <div className="flex">
                      <img 
                        src={booking.propertyId?.image || getDefaultImage()}
                        alt={booking.propertyId?.title}
                        className="w-32 h-full object-cover"
                      />
                      <CardContent className="flex-1 p-4">
                        <h3 className="font-semibold text-lg mb-2">{booking.propertyId?.title}</h3>
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.propertyId?.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              booking.status === "completed" ? "bg-green-100 text-green-800" :
                              booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => navigate(`/bookings/${booking._id}`)}
                          >
                            View Details
                          </Button>
                          {booking.status === "completed" && (
                            <Button size="sm" variant="outline" className="flex-1">
                              Write Review
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GuestDashboard;
