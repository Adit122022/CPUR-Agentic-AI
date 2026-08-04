import java.util.*;

class RecursiveFibonacci {
    int n;

    RecursiveFibonacci(int n) {
        this.n = n;
    }

    int fib(int x) {
        if (x == 0)
            return 0;

        if (x == 1)
            return 1;

        return fib(x - 1) + fib(x - 2);
    }

    void calculate() {
        if (n < 0) {
            System.out.println("Invalid input");
            return;
        }

        System.out.println("Fibonacci term: " + fib(n));
    }
}

public class MainApp {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter position (n): ");
        int n = sc.nextInt();
        sc.close();

        RecursiveFibonacci obj = new RecursiveFibonacci(n);
        obj.calculate();
    }
}