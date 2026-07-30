//  1. 

// let a = [4, 5, 3, 8, 10,20,4,8,6,30];
// let res = [];
//  let sum =0;
// for (let i = 0; i < a.length; i++) {
//     if (a[i] > 9) {
//         res[res.length] = a[i];
//     }else {
//         sum +=a[i]
//     }
// }
// console.log(res ,"sum-->",sum);


// 2 
// let a =40,b=10;
// let product =a*b;
// if(product >=500){
//     console.log("SUM of A,B-->",a+b)
// }else{
//     console.log(product)
//     console.log("Hello SPSU code is running fine !!")
// }


// 3
// let s ="Hello"
// if(s.length > 7 ){
//  for(let i=0;i<s.length;i++){
//     if(i%2==0) console.log(s.charAt(i))
//  }
// } else{
//     for(let i=0;i<s.length;i++){
//     if(i%2!==0) console.log(s.charAt(i))
//  }
// }

// let s ='Hello';
// let ev = s.length >7;
// for(let i=0;i<s.length;i++){
//     if(ev && i%2==0) console.log(s.charAt(i))
//     if(!ev && i%2!==0) console.log(s.charAt(i))
//  }

// 4
// let l1=[11,21,24,12,18];
// let l2=[14,44,25,37,13];
// let l3=[];
// for(let i=0;i<l1.length;i++) if(i%2 !==0) l3.push(l1[i]) //odd index
// for(let i=0;i<l1.length;i++) if(i%2 ===0) l3.push(l2[i]) //even index
// console.log(l3)

// 5

// const e =5;
// const w =7;
// const data = ["PPPPP","PPPPP","PPPPP","PAPAP","AAAAA","PAAAP","PPPPP"];
// let max=0,curr=0;

// for(let i=0;i<w;i++){
//     let pre =true;
//     let today =data[i];
//     for(let j=0;j<e;j++){
//         if(today[j] ==='A') {
//             pre=false;
//             break;
//                 }
//     }
//     if(pre) curr++;
//     else{
//         if(curr > max) max =curr;
//         curr=0;
//     }
// }

// console.log(max)


// 6
// let ar =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
// let arr1=[];
// let sq=[];
// for(let i=0;i<ar.length;i++){
//     if(i<5 ||i>=ar.length-5)
//       arr1.push(ar[i])
// }
// for(let i=0;i<arr1.length;i++){
//     sq.push(arr1[i] * arr1[i])
// }
// console.log(sq)

// 7

// let s ='1cat1cadog'
// let cat=0,dog=0;
// for(let i=0;i<s.length;i++){
//     if(s.substring(i,i+3) ==='cat') cat++;
//     if(s.substring(i,i+3) ==='dog') dog++;
// }
// console.log(cat===dog)


// 8.