// Online C++ compiler to run C++ program online
// #include <iostream>

// int main() {

    //  DIFF B/W WHILE AND FOR
    // Write C++ code here
    // int i =0;
    // while(i<10){
    //     std::cout << i;
    //     if(i ==5) continue;
    //     i++;
    // }
    // int i =0;
    // while(i<10){
    //     std::cout << i;
    //     i++;
    //     if(i ==5) continue;
    // }
    
    
    // for(int  j =0; j<10;j++){
    //     if(j==5) continue;
    //     std::cout << j;
    // }

    // Array 

    //  insertion
    // int a[] =[10,2,5,9,3];
    // int b[6];
    // int id =3;
    // int val =55;
    // for(int i =0;i<(sizeof(a)/sizeof(a));i++){
    //     if(i<id){
    //         b[i] = a[i];
    //     }
    //     if(i==id){
    //         b[i] =val;
    //     }
    //     if(i>id){
    //         b[i]= a[i-1]
    //     }
    // }

    //  deletion

//      int a[] =[10,2,5,9,3];
//     int b[5];
//     int id =3;
//     int val =55;
//     for(int i =0;i<(sizeof(a)/sizeof(a));i++){
//         if(i<id){
//             b[i] = a[i];
//         }
//         if(i==id){
//             b[i] =a[i+1]
//         }
//         if(i>id){
//             b[i]= a[i+1]
//         }
//     }

//     return 0;
// }


// Online C++ compiler to run C++ program online
#include <iostream>
#include <stack>
using namespace std;
void reverse(string s){
    stack<char> arr;
    for(char letter :s){
        arr.push(letter);
    }
    string res;
    while(!arr.empty()){
        res += arr.pop()
    }
      std::cout <<res<<endl;
}

int main() {
    reverse("hello");
    std::cout << letter;
    return 0;
}