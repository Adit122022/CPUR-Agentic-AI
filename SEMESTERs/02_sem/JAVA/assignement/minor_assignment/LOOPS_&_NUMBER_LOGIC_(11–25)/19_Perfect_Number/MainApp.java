// 19. **Perfect Number:** Check if the sum of divisors (excluding itself) equals the number.

import java.util.*;

class PerfectNumber {
    int num;

    PerfectNumber(int num) {
        this.num = num;
    }

    void checkPerfect() {
        int sum = 0;

        for (int i = 1; i <= num / 2; i++) {
            if (num % i == 0) {
                sum += i;
            }
        }

        if (sum == num && num != 0) {
            System.out.println("Perfect Number");
        } else {
            System.out.println("Not a Perfect Number");
        }
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number: ");
        int n = sc.nextInt();
        sc.close();

        PerfectNumber obj = new PerfectNumber(n);
        obj.checkPerfect();
    }
}