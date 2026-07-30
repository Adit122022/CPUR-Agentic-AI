using System;

namespace Simple_ATM_System
{
    class Program
    {
        static void Main(string[] args)
        {
            double balance = 5000.0; // Initial Balance
            bool exit = false;

            Console.WriteLine("--- Welcome to MyMini ATM ---");

            while (!exit)
            {
                Console.WriteLine("\n1. Check Balance");
                Console.WriteLine("2. Deposit Money");
                Console.WriteLine("3. Withdraw Money");
                Console.WriteLine("4. Exit");
                Console.Write("Select an option: ");

                string choice = Console.ReadLine();

                switch (choice)
                {
                    case "1":
                        Console.WriteLine("Your Current Balance: " + balance);
                        break;
                    case "2":
                        Console.Write("Enter Deposit Amount: ");
                        double dep = Convert.ToDouble(Console.ReadLine());
                        balance += dep;
                        Console.WriteLine("Deposit Successful!");
                        break;
                    case "3":
                        Console.Write("Enter Withdrawal Amount: ");
                        double draw = Convert.ToDouble(Console.ReadLine());
                        if (draw <= balance)
                        {
                            balance -= draw;
                            Console.WriteLine("Please collect your cash.");
                        }
                        else
                        {
                            Console.WriteLine("Insufficient Funds!");
                        }
                        break;
                    case "4":
                        exit = true;
                        Console.WriteLine("Thank you for using our ATM.");
                        break;
                    default:
                        Console.WriteLine("Invalid Option. Try again.");
                        break;
                }
            }
        }
    }
}