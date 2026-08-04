// 17. **Palindrome Number:** Check if the number and its reverse are the same.
import java.util.*;

class PalindromeNumber {
    int num;

    PalindromeNumber(int num) {
        this.num = num;
    }

    void checkPalindrome() {
        int temp = num;
        int rev = 0;

        while (temp != 0) {
            rev = rev * 10 + temp % 10;
            temp /= 10;
        }

        if (rev == num) {
            System.out.println("Palindrome Number");
        } else {
            System.out.println("Not a Palindrome");
        }
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number: ");
        int n = sc.nextInt();
        sc.close();

        PalindromeNumber obj = new PalindromeNumber(n);
        obj.checkPalindrome();
    }
}