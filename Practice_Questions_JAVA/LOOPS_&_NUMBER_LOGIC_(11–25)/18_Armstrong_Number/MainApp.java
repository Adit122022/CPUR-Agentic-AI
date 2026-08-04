// 18. **Armstrong Number:** Check if the sum of cubes of digits equals the number ($153 = 1^3+5^3+3^3$).
import java.util.*;

class ArmstrongNumber {
    int num;

    ArmstrongNumber(int num) {
        this.num = num;
    }

    void checkArmstrong() {
        int temp = num;
        int sum = 0;

        while (temp != 0) {
            int digit = temp % 10;
            sum += digit * digit * digit;
            temp /= 10;
        }

        if (sum == num) {
            System.out.println("Armstrong Number");
        } else {
            System.out.println("Not an Armstrong Number");
        }
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number: ");
        int n = sc.nextInt();
        sc.close();

        ArmstrongNumber obj = new ArmstrongNumber(n);
        obj.checkArmstrong();
    }
}