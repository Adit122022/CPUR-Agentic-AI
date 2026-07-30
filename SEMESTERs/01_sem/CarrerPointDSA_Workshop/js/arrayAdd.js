//  insertion

// let  a = [10,5,4,9,10];
//  let b = [];
//   let n = 3
//  for(let i=0;i<a.length+1;i++){
//      if(i<n){
//       b[i] =a[i]
//      }
//      if(i===n){
//          b[i] =555
//      }
//      if(i>n){
//          b[i] =a[i-1]
//      }
//  }
//   console.log("Array A ->",a)
//   console.log("ARRAY b ->",b)

//  deletion
// let  a = [10,5,4,9,10,52,8,52];
//  let b = [];
//   let n = 5
//  for(let i=0;i<a.length-1;i++){
//      if(i<n){
//       b[i] =a[i]
//      }
//      if(i===n){
//          b[i] =a[i+1]
//      }
//      if(i>n){
//         b[i] = a[i+1]
//      }
     
//  }
//   console.log("Array A ->",a)
//   console.log("ARRAY b ->",b)


//  Rain Water Trap 
// let a = [6,5,8,3,8,7];
//  let len = 0;
//  let wid=0;
//  let max =0;

//  let area =0;


//  let i =0;
//  let j=a.length-1;
//  while(i<j){
     
//      len=Math.min(a[i],a[j]);
//      wid =j-i;
//      area =wid *len;
//      max= Math.max(max,area);
//      if(a[i]<a[j]) i++;
//      else j--;
//     }
// console.log(max)


//  PAir Of Sum
// let a =[5,10,13,19,26,30,36,45];
// let i =0;
// let j= a.length-1;
// let sum =0;
// let n =45
// while(i<j){
//      sum =a[i]+a[j];
//      if(sum > n) j--;
//      if(sum< n) i++;
//      if(sum === n) {
//         console.log( a[i],"  -  ",i ,"  -  ",a[j] ,"  -  ",j)
//     break;
// }
// }


//  Searching  


//  Linear Searching
// let a = [5,4,3,9,10,15,16];
//  let b =10;
//  let flag =false;
// for(let i =0; i<a.length;i++){
//     if(a[i] !== b) flag=false;
//     if(a[i]===b) {
//         flag=true;
//         break;
//     }
// }
// console.log(flag ? "Found" :"Not FOund")

//  Binary Search
// let a = [3,4,5,9,10,15,16];
// let n=10
// let i=0,j=a.length-1;
// let flag = false;
// while(i<=j){
//     let mid =Math.floor((i+j)/2);
//     if(a[mid]==n) {
//        flag= true;
//         break;
//     }
//     if(a[mid] < n){
//         i=mid+1;
//     }
//     if(a[mid] > n){
//         j=mid-1;
//     }
// }
// console.log(flag ? "Found" :"Not FOund")

