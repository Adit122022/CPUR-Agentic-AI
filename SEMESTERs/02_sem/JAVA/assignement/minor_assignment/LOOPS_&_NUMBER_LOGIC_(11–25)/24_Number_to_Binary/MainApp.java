
// 24. **Number to Binary:** Convert a decimal number to its binary string.


import java.util.*;

class DecimalToBinary {
    int num;

    DecimalToBinary(int num) {
        this.num = num;
    }

    void convert() {
        int temp = num;
        String binary = "";

        while (temp > 0) {
            binary = (temp % 2) + binary;
            temp /= 2;
        }

        System.out.println("Binary: " + binary);
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter decimal number: ");
        int n = sc.nextInt();
        sc.close();

        DecimalToBinary obj = new DecimalToBinary(n);
        obj.convert();
    }
}