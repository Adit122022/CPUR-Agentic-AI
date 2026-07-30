
###**1. Write program to print the"welcome to java"**

public class Welcome {
    public static void main(String[] args) {
        System.out.println("welcome to java");
    }
}

###**2.

Write a
program to
perform addition, subtraction, division, integer division,
multiplication and
modulo division
on two
integer numbers*
*

import java.util.Scanner;

public class IntArithmetic {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter two integers: ");
        int a = sc.nextInt();
        int b = sc.nextInt();

        System.out.println("Addition: " + (a + b));
        System.out.println("Subtraction: " + (a - b));
        System.out.println("Multiplication: " + (a * b));
        System.out.println("Division: " + ((double) a / b));
        System.out.println("Integer Division: " + (a / b));
        System.out.println("Modulo: " + (a % b));
    }
}

###**3.

Write a
program to
perform addition, subtraction, multiplication
and division
on two
floating point numbers*
*

import java.util.Scanner;

public class FloatArithmetic {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter two float numbers: ");
        float a = sc.nextFloat();
        float b = sc.nextFloat();

        System.out.println("Sum: " + (a + b));
        System.out.println("Difference: " + (a - b));
        System.out.println("Product: " + (a * b));
        System.out.println("Quotient: " + (a / b));
    }
}




### **4. Write a program to swap two numbers using a temporary variable**


public class SwapTemp {
    public static void main(String[] args) {
        int x = 10, y = 20;
        System.out.println("Before: x=" + x + ", y=" + y);
        int temp = x;
        x = y;
        y = temp;
        System.out.println("After: x=" + x + ", y=" + y);
    }
}




### **5. Write a program to swap two numbers without using a temporary variable**


public class SwapNoTemp {
    public static void main(String[] args) {
        int x = 10, y = 20;
        x = x + y; // x = 30
        y = x - y; // y = 10
        x = x - y; // x = 20
        System.out.println("Swapped: x=" + x + ", y=" + y);
    }
}




### **6. Write a program to find the larger of two numbers**

import java.util.Scanner;

public class LargerNum {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter two numbers: ");
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        if(a > b) 
            System.out.println(a + " is larger.");
        else 
            System.out.println(b + " is larger.");
    }
}




### **7. Write a program to find whether the given number is even or odd**

import java.util.Scanner;

public class EvenOdd {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int num = sc.nextInt();
        
     System.out.print(n % 2 == 0 ? "Even" : "Odd");
    }
}




### **8. Write a program to input three numbers and then find largest of them using && operator**

import java.util.Scanner;

public class LargestThree {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter three numbers: ");
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();

        if (a >= b && a >= c)
            System.out.println(a + " is largest.");
        else if (b >= a && b >= c)
            System.out.println(b + " is largest.");
        else
            System.out.println(c + " is largest.");
    }
}

###**9.

Write a
program to
enter the
marks of
a student
in four
subjects then
calculate the total,
aggregate and
display the
result obtained
by the student*
*

import java.util.Scanner;

public class StudentResult {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter marks for 4 subjects:");
        int s1 = sc.nextInt();
        int s2 = sc.nextInt();
        int s3 = sc.nextInt();
        int s4 = sc.nextInt();

        int total = s1 + s2 + s3 + s4;
        double aggregate = total / 4.0;

        System.out.println("Total Marks: " + total);
        System.out.println("Aggregate: " + aggregate + "%");
    }
}




### **10. Write a program to find whether a given year is a leap year or not**

import java.util.Scanner;

public class LeapYear {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a year: ");
        int year = sc.nextInt();

        if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0))
            System.out.println(year + " is a Leap Year.");
        else
            System.out.println(year + " is not a Leap Year.");
    }
}




### **11. Write a program to determine whether an entered character is a vowel or not with the help of switch case statement**

import java.util.Scanner;

public class VowelCheck {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a character: ");
        char ch = sc.next().toLowerCase().charAt(0);

        switch (ch) {
            case 'a': case 'e': case 'i': case 'o': case 'u':
                System.out.println("Vowel");
                break;
            default:
                System.out.println("Not a Vowel");
        }
    }
}




 ### **12. Write a program to enter a number from 1 to 7 and display the corresponding day of the week using switch case statement**

import java.util.Scanner;

public class DayOfWeek {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter day number (1-7): ");
        int day = sc.nextInt();

        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;
            case 4:
                System.out.println("Thursday");
                break;
            case 5:
                System.out.println("Friday");
                break;
            case 6:
                System.out.println("Saturday");
                break;
            case 7:
                System.out.println("Sunday");
                break;
            default:
                System.out.println("Invalid day!");
        }
    }}

    ###**13.

    Write a
    program to
    list all
    the leap
    year from 2000 to 2014 using do-while loop**[cite:1]

    public class LeapYearRange {
        public static void main(String[] args) {
            int year = 2000;
            System.out.println("Leap years between 2000 and 2014:");
            do {
                if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
                    System.out.println(year);
                }
                year++;
            } while (year <= 2014);
        }
    }

    ###**14.

    Write a
    program to
    print the

    following pattern (Solid Rectangle and Right Triangle)**[cite: 1]

public class Pattern14 {
    public static void main(String[] args) {
        System.out.println("Pattern a:");
        for (int i = 1; i <= 4; i++) {
            for (int j = 1; j <= 6; j++) {
                System.out.print("*");
            }
            System.out.println();
        }

        System.out.println("\nPattern b:");
        for (int i = 1; i <= 4; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}


### **15. Write a program to print the

    following patterns (Alphabet, Numbers, and Repeated Digits)**[cite: 1]


public class Pattern15 {
    public static void main(String[] args) {
        System.out.println("Pattern a (Alphabets):");
        for (char i = 'A'; i <= 'F'; i++) {
            for (char j = 'A'; j <= i; j++) {
                System.out.print(j);
            }
            System.out.println();
        }

        System.out.println("\nPattern b (Numbers):");
        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(j);
            }
            System.out.println();
        }

        System.out.println("\nPattern c (Repeated Digits):");
        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(i);
            }
            System.out.println();
        }
    }
}


### **16. Write a program to print the

    following pattern (Number Pyramid)**[cite: 1]

public class Pattern16 {
    public static void main(String[] args) {
        System.out.println("Pattern b (Symmetric Number Pyramid):");
        int rows = 5;
        for (int i = 1; i <= rows; i++) {
            // Print ascending
            for (int j = 1; j <= i; j++) {
                System.out.print(j);
            }
            // Print descending
            for (int j = i - 1; j >= 1; j--) {
                System.out.print(j);
            }
            System.out.println();
        }
    }
}


### **17. Write a program to add two integer numbers using functions**[cite: 1]

import java.util.Scanner;

public class AddFunction {
    public static int add(int num1, int num2) {
        return num1 + num2;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter two integers: ");
        int a = sc.nextInt();
        int b = sc.nextInt();
        int sum = add(a, b);
        System.out.println("The sum is: " + sum);
    }
}

###**18.

Write a
program to
read and
display n
numbers using
an average**[cite:1
]

import java.util.Scanner;

public class AverageCalculation {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the count of numbers: ");
        int n = sc.nextInt();
        int[] numbers = new int[n];
        int sum = 0;

        System.out.println("Enter " + n + " numbers:");
        for (int i = 0; i < n; i++) {
            numbers[i] = sc.nextInt();
            sum += numbers[i];
        }

        double average = (double) sum / n;
        System.out.println("Average of entered numbers: " + average);
    }
}


### **19. Write a program to determine whether an entered number is prime or not.**[cite: 1]

import java.util.Scanner;

public class P {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        String res = " is Prime";
        if (n <= 1) res = " is not Prime";
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) { res = " is not Prime"; break; }
        }
        System.out.print(n + res);
    }
}

###**20.Write a program to input 10 students record (Name, UID, Marks) and display them in ascending order on the output screen.**

import java.util.Scanner;
import java.util.Arrays;
import java.util.Comparator;

class Student {
    String name;
    String uid;
    int marks;

    Student(String name, String uid, int marks) {
        this.name = name;
        this.uid = uid;
        this.marks = marks;
    }
}

public class StudentRecord {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Student[] students = new Student[10];

        for (int i = 0; i < 10; i++) {
            System.out.println("Enter details for student " + (i + 1) + " (Name, UID, Marks):");
            String name = sc.next();
            String uid = sc.next();
            int marks = sc.nextInt();
            students[i] = new Student(name, uid, marks);
        }

        // Sort by marks in ascending order
        Arrays.sort(students, Comparator.comparingInt(s -> s.marks));

        System.out.println("\nRecords in Ascending Order of Marks:");
        for (Student s : students) {
            System.out.println("UID: " + s.uid + " | Name: " + s.name + " | Marks: " + s.marks);
        }
    }
}


21. Tic-Tac-Toe program in java.
  

Java
import java.util.Scanner;

public class TicTacToe {
    public static void main(String[] args) {
        char[][] board = {
                { ' ', ' ', ' ' },
                { ' ', ' ', ' ' },
                { ' ', ' ', ' ' }
        };
        Scanner sc = new Scanner(System.in);
        char player = 'X';
        boolean gameOver = false;

        while (!gameOver) {
            printBoard(board);
            System.out.print("Player " + player + " enter (row and col 0-2): ");
            int row = sc.nextInt();
            int col = sc.nextInt();

            if (board[row][col] == ' ') {
                board[row][col] = player;
                gameOver = haveWon(board, player);
                if (gameOver) {
                    printBoard(board);
                    System.out.println("Player " + player + " has won!");
                } else {
                    player = (player == 'X') ? 'O' : 'X';
                }
            } else {
                System.out.println("Invalid move. Try again!");
            }
        }
    }

    public static void printBoard(char[][] board) {
        for (char[] row : board) {
            for (char col : row) {
                System.out.print("|" + col);
            }
            System.out.println("|");
        }
    }

    public static boolean haveWon(char[][] board, char player) {
        for (int i = 0; i < 3; i++) {
            if (board[i][0] == player && board[i][1] == player && board[i][2] == player)
                return true;
            if (board[0][i] == player && board[1][i] == player && board[2][i] == player)
                return true;
        }
        if (board[0][0] == player && board[1][1] == player && board[2][2] == player)
            return true;
        if (board[0][2] == player && board[1][1] == player && board[2][0] == player)
            return true;
        return false;
    }
}
22.

A simple
project in
java that
generates random
shapes to
resemble English
characters and
then asks
users to
identify them
.

import java.util.Scanner;
import java.util.Random;

public class ShapeCaptcha {
    public static void main(String[] args) {
        String[] captchas = { "A", "H", "X", "T", "L" };
        String[] shapes = {
                "/-\\", // A
                "|-|", // H
                "\\ /", // X
                "---", // T
                "|_ " // L
        };

        int index = new Random().nextInt(shapes.length);
        System.out.println("Identify this character shape: " + shapes[index]);

        Scanner sc = new Scanner(System.in);
        System.out.print("Your Answer: ");
        String answer = sc.next();

        if (answer.equalsIgnoreCase(captchas[index])) {
            System.out.println("Login Successful!");
        } else {
            System.out.println("Access Denied!");
        }
    }
}23. A simple'strong password generator' using java.
You may
use a
combination of alpha-numeric characters
along with
special characters
and numbers
.

import java.security.SecureRandom;

public class PasswordGenerator {
    public static void main(String[] args) {
        String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lower = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String special = "!@#$%^&*()-_=+";
        String all = upper + lower + digits + special;

        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 12; i++) {
            password.append(all.charAt(random.nextInt(all.length())));
        }

        System.out.println("Generated Strong Password: " + password.toString());
    }
}
