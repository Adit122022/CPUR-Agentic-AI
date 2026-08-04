// 12. **Factorial:** Input $N$; find the factorial ($N!$).

import java.util.*;

class Factorial {
    int num;

    Factorial(int num) {
        this.num = num;
    }

    void calculateFactorial() {
        long fact = 1;

        for (int i = 1; i <= num; i++) {
            fact *= i;
        }

        System.out.println("Factorial: " + fact);
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number: ");
        int n = sc.nextInt();
        sc.close();

        Factorial obj = new Factorial(n);
        obj.calculateFactorial();
    }
}