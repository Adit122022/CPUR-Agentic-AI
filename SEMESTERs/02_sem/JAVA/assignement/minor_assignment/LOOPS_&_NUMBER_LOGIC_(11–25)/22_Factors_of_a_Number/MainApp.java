// 22. **Factors of a Number:** Print all factors of a given number.
import java.util.*;

class Factors {
    int num;

    Factors(int num) {
        this.num = num;
    }

    void printFactors() {
        System.out.println("Factors are:");
        for (int i = 1; i <= num; i++) {
            if (num % i == 0) {
                System.out.print(i + " ");
            }
        }
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number: ");
        int n = sc.nextInt();
        sc.close();

        Factors obj = new Factors(n);
        obj.printFactors();
    }
}