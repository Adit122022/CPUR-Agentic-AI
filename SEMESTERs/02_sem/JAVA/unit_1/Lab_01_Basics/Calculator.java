import java.util.Scanner; //  user input k liye scanner class import ki hai

public class Calculator {
    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in); // scanner class ka object banaya hai
        System.out.println("Enter the first number (don't enter in decimal) :");
        long a = sc.nextLong();
        System.out.println("Enter the second number (don't enter in decimal) :");
        long b = sc.nextLong();
        System.out.println("Enter operation u want to perform ( + , - , / , * , % ) :");
        String op = sc.next();
        sc.close();
        switch (op) {
            case "+":
                System.out.println("The sum of " + a + " and " + b + " is " + (a + b));
                break;
            case "-":
                System.out.println("The difference between " + a + " and " + b + " is " + (a - b));
                break;
            case "/":
                System.out.println("The division of " + a + " and " + b + " is " + (a / b));
                break;
            case "*":
                System.out.println("The product of " + a + " and " + b + " is " + (a * b));
                break;
            case "%":
                System.out.println("The remainder of " + a + " and " + b + " is " + (a % b));
                break;
            default:
                System.out.println("Invalid operation");
        }

    }
}