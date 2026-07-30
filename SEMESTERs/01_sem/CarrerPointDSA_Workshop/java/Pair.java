
class Pair {
    public static void main(String[] args) {
        // int[] a = { 5, 10, 13, 19, 26, 30, 36, 45 };
        // int i = 0;
        // int j = a.length - 1;
        // int sum = 0;
        // int n = 45;
        // while (i < j) {
        // sum = a[i] + a[j];
        // if (sum > n)
        // j--;
        // if (sum < n)
        // i++;
        // if (sum == n) {
        // System.out.print(a[i] + " " + a[j]);
        // break;
        // }
        // }

        // Linear Search COmplexity
        // int[] a = { 5, 4, 3, 9, 10, 15, 16 };
        // int b = 10;
        // boolean flag = false;
        // for (int i = 0; i < a.length; i++) {
        //     if (a[i] != b)
        //         flag = false;
        //     if (a[i] == b) {
        //         flag = true;
        //         break;
        //     }
        // }
        // System.out.print(flag ? "Found" : "Not FOund");

        // Binary Search

        // int[] a={5,6,13,24,36,39};
        // int i=0;
        // int j= a.length;
        // while(i<j){
        //     int mid = Math.floorDiv((i+j)/2);

        // }


        //  Bubble Sort
        
int[] a ={2,9,16,3,10,5,4};


for(int i=0;i<a.length-1;i++){
    for(int j=i+1;j<a.length;j++){
        if(a[i]>a[j]) {
            int temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
    }
}

for(int i=0;i<a.length;i++){
    System.out.println(a[i]);
}
    }
}