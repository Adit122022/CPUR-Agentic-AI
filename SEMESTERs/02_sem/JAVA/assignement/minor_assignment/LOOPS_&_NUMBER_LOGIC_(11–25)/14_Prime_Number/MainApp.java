// 14. **Prime Number:** Input $N$; check if it is a Prime Number.
import java.util.*;

class PrimeCheck {
    int num;

    PrimeCheck(int num) {
        this.num = num;
    }

    void checkPrime() {
        if (num <= 1) {
            System.out.println("Not Prime");
            return;
        }

        for (int i = 2; i <= num / 2; i++) {
            if (num % i == 0) {
                System.out.println("Not Prime");
                return;
            }
        }

        System.out.println("Prime Number");
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number: ");
        int n = sc.nextInt();
        sc.close();

        PrimeCheck obj = new PrimeCheck(n);
        obj.checkPrime();
    }
}