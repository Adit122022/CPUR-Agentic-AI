namespace HotelManagementWeb.Models
{
    public class Booking
    {
        public string GuestName { get; set; }
        public int RoomNumber { get; set; }
        public string RoomType { get; set; }
        public int NumberOfNights { get; set; }
        public double CostPerNight { get; set; }
        public double ServiceCharges { get; set; }

        // Logic: Bill calculate karne ka method
        public double CalculateTotal()
        {
            return (NumberOfNights * CostPerNight) + ServiceCharges;
        }
    }
}