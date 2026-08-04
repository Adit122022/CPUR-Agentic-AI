import java.util.*;
class BubbleSort {
    int[] arr;

    BubbleSort(int[] arr) {
        this.arr = arr;
    }

    void sort() {
        for(int i = 0; i < arr.length - 1; i++) {
            for(int j = 0; j < arr.length - 1 - i; j++) {
                if(arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }

        System.out.println("Sorted Array:");
        for(int num : arr)
            System.out.print(num + " ");
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

        BubbleSort obj = new BubbleSort(arr);
        obj.sort();
    }
}