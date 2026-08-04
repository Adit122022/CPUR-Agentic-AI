
import java.util.*;
class Frequency {
    int[] arr;

    Frequency(int[] arr) {
        this.arr = arr;
    }

    void countFrequency() {
        for(int i = 0; i < arr.length; i++) {
            int count = 1;
            boolean visited = false;

            for(int k = 0; k < i; k++) {
                if(arr[i] == arr[k]) {
                    visited = true;
                    break;
                }
            }

            if(visited) continue;

            for(int j = i+1; j < arr.length; j++) {
                if(arr[i] == arr[j]) {
                    count++;
                }
            }

            System.out.println(arr[i] + " occurs " + count + " times");
        }
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

        Frequency obj = new Frequency(arr);
        obj.countFrequency();
    }
}