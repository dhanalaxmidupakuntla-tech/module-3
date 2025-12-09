// external file contain reusable code
// imported into other js file
// can contain variable, classes, function ...
// introduce as part of ecmascript 2025 update es6

import {pi, getCircuference, getArea, getVolume} from  './math.js'

let radius = 3;

console.log(getArea(radius))
console.log(getCircuference(radius))
console.log(getVolume(radius))