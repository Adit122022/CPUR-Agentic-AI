// 25. **Spy Number:** Check if the sum of digits equals the product of digits (e.g., 1124).
// Sum of digits == Product of digits
// Sum = 1+1+2+4 = 8
// Product = 1×1×2×4 = 8
import java.util.*;

class SpyNumber {
    int num;

    SpyNumber(int num) {
        this.num = num;
    }

    void checkSpy() {
        int temp = num;
        int sum = 0;
        int product = 1;

        while (temp != 0) {
            int digit = temp % 10;
            sum += digit;
            product *= digit;
            temp /= 10;
        }

        if (sum == product) {
            System.out.println("Spy Number");
        } else {
            System.out.println("Not a Spy Number");
        }
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number: ");
        int n = sc.nextInt();
        sc.close();

        SpyNumber obj = new SpyNumber(n);
        obj.checkSpy();
    }
}