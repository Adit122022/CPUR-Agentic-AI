// 6. **Largest of Two:** Input two numbers; find the greater one.
import java.util.*;

class LargestNumber {
    int num1;
    int num2;

    LargestNumber(int num1, int num2) {
        this.num1 = num1;
        this.num2 = num2;
    }

    void findLargest() {
        if (num1 == num2) {
            System.out.println("Both numbers are equal.");
        } else {
            int largest = (num1 > num2) ? num1 : num2;
            System.out.println("Largest number is: " + largest);
        }
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter first number: ");
        int n1 = sc.nextInt();

        System.out.print("Enter second number: ");
        int n2 = sc.nextInt();

        sc.close();

        LargestNumber obj = new LargestNumber(n1, n2);
        obj.findLargest();
    }
}