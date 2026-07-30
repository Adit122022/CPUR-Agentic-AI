import java.util.*;
class RecursiveFactorial {
    int n;

    RecursiveFactorial(int n) {
        this.n = n;
    }

    int factorial(int x) {
        if(x == 0 || x == 1)
            return 1;
        return x * factorial(x - 1);
    }

    void calculate() {
        System.out.println("Factorial: " + factorial(n));
    }
}

class MainApp {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter size: ");
        int n = sc.nextInt();
        sc.close();

        RecursiveFactorial obj = new RecursiveFactorial(n);
        obj.calculate();
    }
}