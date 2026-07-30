using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace class_01
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Enter YOur Name Cuty Bueaty : ");
            string user_name = Console.ReadLine();
            Console.WriteLine("Enter YOur Age :");
            int age = Convert.ToInt32(Console.ReadLine());

            Console.WriteLine("Welcome " + user_name + " , You are " + age +" old.");
            // 2. Ref Parameter (Value change ho jayegi)
            int myVal = 10;
            Console.WriteLine("Before Ref: " + myVal);
            ChangeValue(ref myVal);
            Console.WriteLine("After Ref: " + myVal);

            // 3. Out Parameter (Value bahar aayegi)
            int result;
            GiveValue(out result);
            Console.WriteLine("Out Result: " + result);

            // Screen ko rokne ke liye
            Console.WriteLine("\nPress Enter to close...");
            Console.ReadLine();
        }
        //Ref Method
        static void ChangeValue(ref int x)
        {
            x = x + 50;
        }
        //Out Method
        static void GiveValue(out int y)
        {
            y = 100;
        }
    }
}
