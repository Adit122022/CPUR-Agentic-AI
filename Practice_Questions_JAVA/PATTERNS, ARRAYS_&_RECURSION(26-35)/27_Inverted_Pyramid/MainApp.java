// 27. **Inverted Pyramid:** Print a centered inverted pyramid of stars.
import java.util.*;

class InvertedPyramid {
    int n;

    InvertedPyramid(int n) {
        this.n = n;
    }

    void printPattern() {
        for(int i = n; i >= 1; i--) {

            for(int space = 0; space < n - i; space++)
                System.out.print(" ");

            for(int star = 1; star <= (2*i - 1); star++)
                System.out.print("*");

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

        InvertedPyramid obj = new InvertedPyramid(n);
        obj.printPattern();
    }
}