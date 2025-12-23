const price = [5, 30, 80, 78, 23]

const total = price.reduce(function(accumlator, element){
    return accumlator * element;
},1)
console.log(total)

