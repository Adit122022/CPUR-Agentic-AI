// 20. **Power Calculation:** Input base and exponent; calculate $base^{exponent}$ without `Math.pow`.

import java.util.*;

class PowerCalculation {
    int base, exponent;

    PowerCalculation(int base, int exponent) {
        this.base = base;
        this.exponent = exponent;
    }

    void calculatePower() {
        long result = 1;

        for (int i = 1; i <= exponent; i++) {
            result *= base;
        }

        System.out.println("Result: " + result);
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter base: ");
        int b = sc.nextInt();
        System.out.print("Enter exponent: ");
        int e = sc.nextInt();
        sc.close();

        PowerCalculation obj = new PowerCalculation(b, e);
        obj.calculatePower();
    }
}