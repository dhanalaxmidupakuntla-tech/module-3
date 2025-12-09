function createData(){
    fetch("https://mydata-4110c-default-rtdb.asia-southeast1.firebasedatabase.app/mydata.json", 
        {method: "POST", body:JSON.stringify({
            name: "John Doe",
            rollno:1,
        })
    })
    .then((res) => res.json())
    .then((data) => console.log("Data is addad", data))
}
function getData(){
    fetch("https://mydata-4110c-default-rtdb.asia-southeast1.firebasedatabase.app/mydata.json", 
    {method: "GET"})
    .then((res) => res.json())
    .then((data) => console.log("get the data", data))

}
function updateData(){

}
function deleteData(){
}