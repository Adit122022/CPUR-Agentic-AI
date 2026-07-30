// 23. **GCD/HCF:** Input two numbers; find their Greatest Common Divisor.
import java.util.*;

class GCD {
    int a, b;

    GCD(int a, int b) {
        this.a = a;
        this.b = b;
    }

    int findGCD(int x, int y) {
        if (y == 0) {
            return x;
        }
        return findGCD(y, x % y);
    }

    void calculateGCD() {
        int result = findGCD(a, b);
        System.out.println("GCD is: " + result);
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter First numbers: ");
        int n1 = sc.nextInt();
        System.out.print("Enter Second numbers: ");
        int n2 = sc.nextInt();
        sc.close();

        GCD obj = new GCD(n1, n2);
        obj.calculateGCD();
    }
}