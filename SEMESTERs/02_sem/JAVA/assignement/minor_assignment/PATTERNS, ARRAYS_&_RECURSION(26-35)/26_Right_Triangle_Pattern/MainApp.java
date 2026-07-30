// 26. **Right Triangle Pattern:** Print a star pattern for $N$ rows.
import java.util.*;

class RightTriangle {
    int n;

    RightTriangle(int n) {
        this.n = n;
    }

    void printPattern() {
        for(int i = 1; i <= n; i++) {
            for(int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter rows: ");
        int n = sc.nextInt();
        sc.close();

        RightTriangle obj = new RightTriangle(n);
        obj.printPattern();
    }
}