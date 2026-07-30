using System;

namespace HotelBookingApp
{

    public class HotelBooking
    {
        public string GuestName;
        public string RoomType;
        public int RoomNumber;
        public int NumberOfNights;
        public double CostPerNight;

        public void DisplayBill(double additionalServices)
        {
            double total = (NumberOfNights * CostPerNight) + additionalServices;

            Console.WriteLine("\n--- FINAL HOTEL BILL ---");
            Console.WriteLine("Guest: " + GuestName);
            Console.WriteLine("Room Number: " + RoomNumber);
            Console.WriteLine("Room Type: " + RoomType);
            Console.WriteLine("Nights: " + NumberOfNights);
            Console.WriteLine("Total Charges: $" + total);
            Console.WriteLine("------------------------");
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            HotelBooking booking = new HotelBooking();

            Console.WriteLine("=== Hotel Management System ===");

            Console.Write("Enter Guest Name: ");
            booking.GuestName = Console.ReadLine();

            Console.Write("Enter Room Type (eg Delux , Normal etc): ");
            booking.RoomType = Console.ReadLine();

            Console.Write("Enter Room Number: ");
            booking.RoomNumber = Convert.ToInt32(Console.ReadLine());

            Console.Write("Enter Number of Nights: ");
            booking.NumberOfNights = Convert.ToInt32(Console.ReadLine());

            Console.Write("Enter Cost Per Night: ");
            booking.CostPerNight = Convert.ToDouble(Console.ReadLine());

            Console.Write("Enter Additional Service Charges: ");
            double extras = Convert.ToDouble(Console.ReadLine());


            booking.DisplayBill(extras);

            Console.WriteLine("\nDone! Press any key to close.");
            Console.ReadKey();
        }
    }
}