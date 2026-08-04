import java.util.*;

class TwoSum {
    int[] arr;
    int target;

    TwoSum(int[] arr, int target) {
        this.arr = arr;
        this.target = target;
    }

    void findTwoSum() {
        HashMap<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < arr.length; i++) {
            int complement = target - arr[i];

            if (map.containsKey(complement)) {
                System.out.println("Indices: " + map.get(complement) + " , " + i);
                return;
            }

            map.put(arr[i], i);
        }

        System.out.println("No pair found");
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

        System.out.print("Enter target: ");
        int target = sc.nextInt();
        sc.close();

        TwoSum obj = new TwoSum(arr, target);
        obj.findTwoSum();
    }
}