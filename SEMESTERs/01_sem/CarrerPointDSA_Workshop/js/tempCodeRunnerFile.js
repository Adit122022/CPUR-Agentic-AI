for(let i=0;i<a.length;i++){
    let small = i;
    for(let j=i+1;j<a.length;j++) if(a[small] >a[j]) [a[j],a[small]]=[a[small],a[j]]
}
 console.log(a)