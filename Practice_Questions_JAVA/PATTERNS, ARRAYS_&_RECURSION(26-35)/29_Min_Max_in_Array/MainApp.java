// 29. **Min/Max in Array:** Find the smallest and largest element in an array.
import java.util.*;
class MinMax {
    int[] arr;

    MinMax(int[] arr) {
        this.arr = arr;
    }

    void findMinMax() {
        int min = arr[0];
        int max = arr[0];

        for(int num : arr) {
            if(num < min) min = num;
            if(num > max) max = num;
        }

        System.out.println("Min: " + min);
        System.out.println("Max: " + max);
    }
}

class MainApp {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter size: ");
        int n = sc.nextInt();

        int[] arr = new int[n];

        System.out.println("Enter elements:");
        for(int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }

        sc.close();

        MinMax obj = new MinMax(arr);
        obj.findMinMax();
    }
}