// 15. **Sum of Digits:** Input a number; calculate the sum of its digits (e.g., $123 \rightarrow 6$).
import java.util.*;

class SumOfDigits {
    int num;

    SumOfDigits(int num) {
        this.num = num;
    }

    void calculateSum() {
        int sum = 0;
        int temp = num;

        while (temp != 0) {
            sum += temp % 10;
            temp /= 10;
        }

        System.out.println("Sum of digits: " + sum);
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number: ");
        int n = sc.nextInt();
        sc.close();

        SumOfDigits obj = new SumOfDigits(n);
        obj.calculateSum();
    }
}