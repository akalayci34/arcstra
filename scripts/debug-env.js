require("dotenv").config();

const key = process.env.CIRCLE_API_KEY;

console.log("Loaded:", !!key);
console.log("Length:", key.length);

const parts = key.split(":");

console.log("Parts:", parts.length);

parts.forEach((p,i)=>{
    console.log(
        `Part ${i+1} length:`,
        p.trim().length
    );
});
