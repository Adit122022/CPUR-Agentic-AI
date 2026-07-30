// 11. **Multiplication Table:** Input $N$; print its table up to 10.

import java.util.*;

class MultiplicationTable {
    int num;

    MultiplicationTable(int num) {
        this.num = num;
    }

    void printTable() {
        for (int i = 1; i <= 10; i++) {
            System.out.println(num + " x " + i + " = " + (num * i));
        }
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number: ");
        int n = sc.nextInt();
        sc.close();

        MultiplicationTable obj = new MultiplicationTable(n);
        obj.printTable();
    }
}