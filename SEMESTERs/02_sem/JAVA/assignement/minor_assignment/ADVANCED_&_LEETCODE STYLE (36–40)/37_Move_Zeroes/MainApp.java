import java.util.*;

class MoveZeroes {
    int[] arr;

    MoveZeroes(int[] arr) {
        this.arr = arr;
    }

    void move() {
        int index = 0;

        for (int i = 0; i < arr.length; i++) {
            if (arr[i] != 0) {
                int temp = arr[index];
                arr[index] = arr[i];
                arr[i] = temp;
                index++;
            }
        }

        System.out.println("Result:");
        for (int num : arr)
            System.out.print(num + " ");
    }
}

public class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter size: ");
        int n = sc.nextInt();

        int[] arr = new int[n];
        System.out.println("Enter elements:");
        for (int i = 0; i < n; i++)
            arr[i] = sc.nextInt();

        sc.close();

        MoveZeroes obj = new MoveZeroes(arr);
        obj.move();
    }
}