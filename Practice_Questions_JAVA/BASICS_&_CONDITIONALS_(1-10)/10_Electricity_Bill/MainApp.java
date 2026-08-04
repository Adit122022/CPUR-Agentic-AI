// **Electricity Bill:** Input units; calculate bill (0-100: $5/u, 101-200: $7/u, >200: $10/u).

import java.util.*;

class ElectricityBill {
    int units;

    ElectricityBill(int units) {
        if (units >= 0) {
            this.units = units;
        } else {
            this.units = -1;
        }
    }

    void calculateBill() {
        if (units == -1) {
            System.out.println("Invalid Units");
            return;
        }

        double bill;

        if (units <= 100) {
            bill = units * 5;
        } else if (units <= 200) {
            bill = (100 * 5) + (units - 100) * 7;
        } else {
            bill = (100 * 5) + (100 * 7) + (units - 200) * 10;
        }

        System.out.println("Total Bill: $" + bill);
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter units: ");
        int units = sc.nextInt();
        sc.close();

        ElectricityBill obj = new ElectricityBill(units);
        obj.calculateBill();
    }
}