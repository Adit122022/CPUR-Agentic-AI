// 16. **Reverse Number:** Input a number; print it in reverse (e.g., $123 \rightarrow 321$).

import java.util.*;

class ReverseNumber {
    int num;

    ReverseNumber(int num) {
        this.num = num;
    }

    void reverse() {
        int rev = 0;
        int temp = num;

        while (temp != 0) {
            rev = rev * 10 + temp % 10;
            temp /= 10;
        }

        System.out.println("Reversed number: " + rev);
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number: ");
        int n = sc.nextInt();
        sc.close();

        ReverseNumber obj = new ReverseNumber(n);
        obj.reverse();
    }
}