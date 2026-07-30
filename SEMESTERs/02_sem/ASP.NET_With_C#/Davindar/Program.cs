using System;

class SchoolFee
{
    string studentName;
    double tuitionFee, transportFee, examFee, totalFee;

    public void InputDetails()
    {
        Console.Write("Enter Student Name: ");
        studentName = Console.ReadLine();

        Console.Write("Enter Tuition Fee: ");
        tuitionFee = Convert.ToDouble(Console.ReadLine());

        Console.Write("Enter Transport Fee: ");
        transportFee = Convert.ToDouble(Console.ReadLine());

        Console.Write("Enter Exam Fee: ");
        examFee = Convert.ToDouble(Console.ReadLine());
    }

    public void CalculateTotal()
    {
        totalFee = tuitionFee + transportFee + examFee;
    }

    public void DisplayFee()
    {
        Console.WriteLine("\nStudent Name: " + studentName);
        Console.WriteLine("Total Fee: " + totalFee);
    }
}

class Program
{
    static void Main()
    {
        SchoolFee s = new SchoolFee();
        s.InputDetails();
        s.CalculateTotal();
        s.DisplayFee();
    }
}