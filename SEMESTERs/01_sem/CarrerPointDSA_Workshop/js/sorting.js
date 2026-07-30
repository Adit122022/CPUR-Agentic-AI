// Sorting


// Bubble Sort 
let a =[2,9,16,3,10,5,4]
// for(let i=0;i<a.length-1;i++){
//     for(let j=i+1;j<a.length;j++){
//         if(a[i]>a[j]) [a[i],a[j]] =[a[j],a[i]]
//     }
// }
//  console.log(a)


//  Selection sort 
// for(let i=0;i<a.length;i++){
//     let small = i;
//     for(let j=i+1;j<a.length;j++) if(a[small] >a[j]) small=j;
//     [a[i],a[small]]=[a[small],a[i]]
// }
//  console.log(a)

// Stack
// class Stack{
//     constructor(){
//         this.stack=[];
//         this.top = 0;
//     }
//     pop(){
//          if (this.isEmpty())   return "Stack is empty";
//         this.top--;
//         let removed = this.stack[this.top];
//         return removed;
//     }
//     push(num){
//         this.stack[this.top] =num;
//         this.top++;
//     }
//     isEmpty(){
//         return this.top === 0
//     }
//     isFull(){
//         return this.top>=0
//     }
//     show(){
//         console.log(this.stack)
//     }
// }

//  const obj = new Stack();
// obj.push(5);
// obj.pop();
// obj.show();
// console.log(obj.isFull());

// Queue

// class Queue{
//     constructor(){
//         this.queue =[];
//         this.front =-1;
//         this.rear =-1;
//     }
//      isEmpty(){
//         return this.front === this.rear
//      }
//      enqueue(num){
//          this.rear++;
//         this.queue[this.rear] = num;
//         if(this.isEmpty()) this.front++;
//      }
//      show(){
//         console.log(this.queue)
//      }
//      dequeue(){
//         if(this.isEmpty()) return "Queue is Empty"
//         this.front++
//         let result= this.queue[this.front];
//         return result
//      }
// }

//  const obj = new Queue();
//  obj.show()
// console.log( obj.isEmpty())
// obj.enqueue(5)
// obj.enqueue(4)
// obj.enqueue(3)
// console.log(obj.dequeue().pop())
// obj.show()
// console.log( obj.isEmpty())


// 1 Anagram String
//  const IsAngram =(str , str1)=>{
//     if(str.length !== str1.length) return false;
//     return str1.split('').sort().join() === str.split('').sort().join()
//  }
//   console.log(IsAngram('hello','helo'))

// 2 find the carry

// let n1=999;
// let n2 =111;
//  let count=0;
// while(n1 !==0 && n2!==0){
// let num1 = n1 %10
// let num2 = n2 %10
// let sum = num1+num2
// if(sum >=10) count++;
// n1=Math.floor(n1/10)
// n2=Math.floor(n2/10)
// }

//  console.log(count)



let reverse=(s)=>{
    let arr =[];
  s.split('').forEach(letter => arr.push(letter));
  console.log(arr)
    let res =[];
    while(!arr.length==0){
        res.push(arr.pop())
    }
      console.log(res.join(''))
}

reverse("hello");
