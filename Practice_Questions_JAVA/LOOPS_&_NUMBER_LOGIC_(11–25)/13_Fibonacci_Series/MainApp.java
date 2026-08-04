// 13. **Fibonacci Series:** Input $N$; print the first $N$ terms of the series.
import java.util.*;

class Fibonacci {
    int terms;

    Fibonacci(int terms) {
        this.terms = terms;
    }

    void printSeries() {
        int a = 0, b = 1;

        for (int i = 1; i <= terms; i++) {
            System.out.print(a + " ");
            int next = a + b;
            a = b;
            b = next;
        }
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter terms: ");
        int n = sc.nextInt();
        sc.close();

        Fibonacci obj = new Fibonacci(n);
        obj.printSeries();
    }
}